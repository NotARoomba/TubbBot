const { Channel } = require("discord.js");

module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(message, args){
        
const waitEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Ping`)
    .setDescription(`Finding ping to bot!...`);

const pingEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Ping`)
    .setDescription(`Your ping is ${Date.now() - message.createdTimestamp} ms`);

        channel.send(waitEmbed).then((resultmessage) => {
            channel.send(pingEmbed)
            target=_blank
        })
    }
};
