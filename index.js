const express = require('express');
const bodyParser = require('body-parser');
const mineflayer = require('mineflayer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let bots = {};

// Bot join
app.post('/mcjoin', (req, res) => {
    const { player } = req.body;
    if (!player) return res.status(400).send("Missing player");
    if (bots[player]) return res.status(200).send("Already joined");

    const bot = mineflayer.createBot({
        host: 'minecraft.server.ip',
        port: 25565,
        username: player,
        auth: 'mojang'
    });

    bot.once('login', () => {
        console.log(`${player} joined Minecraft server`);
        bots[player] = bot;
        res.status(200).send("Joined");
    });

    bot.once('error', (err) => {
        console.log(`[ERROR] ${player} failed: ${err.message}`);
        res.status(400).send("Failed to join. Make sure you own the game.");
    });

    bot.on('chat', (username, message) => {
        console.log(`[MC] ${username}: ${message}`);
        // TODO: relay to FiveM server if needed
    });
});

// Send chat
app.post('/mcchat', (req, res) => {
    const { player, message } = req.body;
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

// Start server
app.listen(3000, () => console.log("Bridge server listening on port 3000"));
