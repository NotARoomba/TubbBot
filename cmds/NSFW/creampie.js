const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'creampie',
    group: 'NSFW',
    usage: `creampie`,
    NSFW: true,
    aliases: ['cp'],
    description: 'So hot, sticky, and inside uwu',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.creampie()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}