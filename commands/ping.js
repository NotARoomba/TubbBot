const Discord = require('discord.js');

const client = new Discord.Client();

module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(message, args){
        
const pingEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Ping`)
    .setDescription(`Finding ping to bot!...`)
        
        message.reply(pingEmbed).then((resultMessage) => {
            message.reply(`Your ping is ${Date.now() - message.createdTimestamp} ms`)
            target=_blank
        })
    }
};
