const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'hentaigif',
    group: 'NSFW',
    usage: `hentaigif`,
    NSFW: true,
    aliases: ['hg', 'hgif'],
    description: 'Basically an animated image, so yes :3',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.gif()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}