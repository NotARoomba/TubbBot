const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'neko',
    group: 'NSFW',
    usage: `neko`,
    NSFW: true,
    description: 'NSFW Neko Girls (Cat Girls)',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.neko()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}