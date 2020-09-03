const Discord = require('discord.js');

const client = new Discord.Client();

module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(message, args){
        
const waitEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Ping`)
    .setDescription(`:apple: Finding ping to bot...
   :alarm_clock: Your ping is ${Date.now() - message.createdTimestamp} ms`)
    message.reply(waitEmbed).then((resultMessage) => {
        target=_blank
        })
    }
};
