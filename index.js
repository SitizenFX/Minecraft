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

    const bot = mineflayer.createBot({
        host: 'minecraft.server.ip', // Replace with your server IP
        port: 25565,                 // Replace with your Minecraft port
        username: player,
        auth: 'mojang'               // or 'microsoft' depending on account
    });

    bot.on('login', () => {
        console.log(`${player} joined Minecraft server`);
        bots[player] = bot;
        res.status(200).send("Joined");
    });

    bot.on('chat', (username, message) => {
        console.log(`[MC] ${username}: ${message}`);
    });

    bot.on('error', (err) => console.log(err));
});

app.post('/mcchat', (req, res) => {
    const { player, message } = req.body;
    const bot = bots[player];
    if (!bot) return res.status(400).send("Bot not connected");
    bot.chat(message);
    res.status(200).send("Message sent");
});

app.listen(3000, () => console.log("Bridge server listening on port 3000"));
      
