const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'orgy',
    group: 'NSFW',
    usage: `orgy`,
    NSFW: true,
    description: 'Group Lewd Acts',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.orgy()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}