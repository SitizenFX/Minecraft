const express = require('express');
const bodyParser = require('body-parser');
const mineflayer = require('mineflayer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let bots = {};

app.post('/mcjoin', (req, res) => {
    const { player } = req.body;

    if (bots[player]) return res.status(200).send("Already joined");

    // Create the bot
    const bot = mineflayer.createBot({
        host: 'minecraft.server.ip', // Replace with your Minecraft server IP
        port: 25565,                 // Replace with Minecraft port
        username: player,            // Player username (must own Minecraft)
        auth: 'mojang'               // or 'microsoft'
    });

    // Handle successful login
    bot.on('login', () => {
        console.log(`${player} joined Minecraft server`);
        bots[player] = bot;
        res.status(200).send("Joined");
    });

    // Handle login errors (invalid account)
    bot.on('error', (err) => {
        console.log(`[ERROR] ${player} failed to join: ${err.message}`);
        res.status(400).send("Failed to join. Make sure you own the game.");
    });

    // Optional: relay chat from Minecraft to FiveM
    bot.on('chat', (username, message) => {
        console.log(`[MC] ${username}: ${message}`);
        // TODO: send message back to FiveM clients if needed
    });
});

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

app.listen(3000, () => console.log("Bridge server listening on port 3000"));
        
