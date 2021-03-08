const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'blowjob',
    group: 'NSFW',
    usage: `blowjob`,
    NSFW: true,
    aliases: ['bj'],
    description: 'Basically an image of a girl sucking on a sharp blade!',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.blowjob()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}