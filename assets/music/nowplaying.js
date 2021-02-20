const Discord = require('discord.js')
module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Display the currently playing song!',
    async execute(message, args, client) {
        let track = client.player.nowPlaying(message)
        const embed = new Discord.MessageEmbed()
            .setColor('#AEA200')
            .setTitle(`:notes: ${track.title}`)
            .setThumbnail(track.thumbnail)
            .setURL(track.url)
            .setDescription(`${client.player.createProgressBar(message, { timecodes: true })}`);
        message.channel.send(embed);
    }
}