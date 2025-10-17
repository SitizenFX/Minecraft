const express = require('express');
const bodyParser = require('body-parser');
const mineflayer = require('mineflayer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Store Minecraft bots per player
let bots = {};

/**
 * Endpoint to make a bot join the Minecraft server
 * POST /mcjoin
 * Body: { "player": "username" }
 */
app.post('/mcjoin', (req, res) => {
    const { player } = req.body;
    if (!player) return res.status(400).send("Missing player");

    if (bots[player]) return res.status(200).send("Already joined");

    // Create bot
    const bot = mineflayer.createBot({
        host: 'minecraft.server.ip', // Replace with your Minecraft server IP
        port: 25565,                 // Replace with Minecraft port
        username: player,            // Must be a valid Minecraft account
        auth: 'mojang'               // or 'microsoft'
    });

    // On successful login
    bot.once('login', () => {
        console.log(`[MC] ${player} joined Minecraft server`);
        bots[player] = bot;
        res.status(200).send("Joined");
    });

    // On login error
    bot.once('error', (err) => {
        console.log(`[ERROR] ${player} failed to join: ${err.message}`);
        res.status(400).send("Failed to join. Make sure you own the game.");
    });

    // Optional: relay chat from Minecraft to FiveM server
    bot.on('chat', (username, message) => {
        console.log(`[MC] ${username}: ${message}`);
        // TODO: send to FiveM server via HTTP / WebSocket
    });
});

/**
 * Endpoint to send a chat message from FiveM to Minecraft bot
 * POST /mcchat
 * Body: { "player": "username", "message": "text" }
 */
app.post('/mcchat', (req, res) => {
    const { player, message } = req.body;
    if (!player || !message) return res.status(400).send("Missing player or message");

    const bot = bots[player];
    if (!bot) return res.status(400).send("Bot not connected");

    try {
        bot.chat(message);
        res.status(200).send("Message sent");
    } catch (err) {
        console.log(`[ERROR] ${player} chat failed: ${err.message}`);
        res.status(400).send("Failed to send message.");
    }
});

// Optional: check bot status
app.get('/status/:player', (req, res) => {
    const bot = bots[req.params.player];
    res.send({ connected: !!bot });
});

// Start server
app.listen(3000, () => console.log("[Bridge] Minecraft bridge listening on port 3000"));
