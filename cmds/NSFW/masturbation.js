const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'masturbation',
    group: 'NSFW',
    usage: `masturbation`,
    NSFW: true,
    description: 'You like lewd solo?~',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.blowjob()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}