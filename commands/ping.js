const Discord = require('discord.js');

const client = new Discord.Client();

module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(message, args){
        
const waitEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Ping`)
    .setDescription(`Finding ping to bot!...`)

    message.reply(waitEmbed).then((resultMessage) => {
    const pingEmbed = new Discord.MessageEmbed()
        .setColor('#8B0000')
        .setTitle(`Ping`)
        .setDescription(`Your ping is ${Date.now() - message.createdTimestamp} ms`)           
        
        message.reply(pingEmbed)
            target=_blank
        })
    }
};
