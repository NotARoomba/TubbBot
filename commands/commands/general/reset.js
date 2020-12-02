const Discord = require('discord.js')
const client = new Discord.Client()
const dtoken = require('@root/config.json')

module.exports = {
    commands: ['reset', 'kill'],
    minArgs: 0,
    maxArgs: 0,
    description: 'Kill me to restart me!',
    callback: (message, arguments, text) => {
        console.log(`Command: reset 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
        if (message.author.id !== "465917394108547072") return false;
        message.reply("Resetting...");
        client.destroy();
        client.login(dtoken);
    }
}