const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'ass',
    group: 'NSFW',
    usage: `ass`,
    NSFW: true,
    description: 'I know you like anime ass~ uwu',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.ass()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}