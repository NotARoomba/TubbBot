const Discord = require("discord.js");
const HMfull = require("hmfull");
module.exports = {
    name: 'hentai',
    group: 'NSFW',
    usage: `hentai`,
    NSFW: true,
    description: 'Sends a random vanilla hentai imageURL~',
    async execute(message) {
        const image = HMfull.HMtai.nsfw.hentai()
        const embed = new Discord.MessageEmbed()
            .setColor('#A55')
            .setImage(image.url)
        message.channel.send(embed)
    }
}