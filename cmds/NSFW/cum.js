const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'cum',
    group: 'NSFW',
    usage: `cum`,
    NSFW: true,
    description: 'Basically sticky white stuff that is usually milked from sharpies.',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.cum()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}