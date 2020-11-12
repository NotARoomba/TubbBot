const Discord = require('discord.js')
const client = new Discord.Client()


module.exports = {
    commands: ['reload', 'kill'],
    minArgs: 0,
    maxArgs: 0,
    description: 'Kill me to restart me!',
    callback: (message, arguments, text) => {
        if (message.author.id !== "465917394108547072") return false;
        message.reply("Resetting...");
        client.destroy();
        client.login('NzUwMTIzNjc3NzM5MTIyODE5.X019HQ.m8ieoPXK1T5f5xJaH0e1K8N3wII');
    }
}