const Discord = require('discord.js');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Plays music!',
    async execute(message, args, client) {
        client.player.play(message, args, true);
        client.player.on('trackStart', (message, track) => {
            const embed = new Discord.MessageEmbed()
                .setColor('#FFED00')
                .addField(`:notes: Now Playing:`, `[${track.title}](${track.url})`)
                .addField(':stopwatch: Duration:', track.duration)
                .setThumbnail(track.thumbnail)
                .setURL(track.url)
                .setFooter(`Requested by ${track.requestedBy.username}#${track.requestedBy.discriminator}!`, `https://cdn.discordapp.com/avatars/${track.requestedBy.id}/${track.requestedBy.avatar}.png`)
            message.channel.send(embed)
        })
        client.player.on('noResults', (message, query) => {
            message.reply(`I couldn't find any results for \`${query}\``)
        })
        client.player.on('trackAdd', (message, queue, track) => {
            const embed = new Discord.MessageEmbed()
                .setColor('#FFED00')
                .setTitle(`:musical_note: ${track.title}`)
                .addField(
                    `Has been added to queue. `,
                    `This song is #${queue.tracks.length} in queue`
                )
                .setThumbnail(track.thumbnail)
                .setURL(track.url)
            message.channel.send(embed)
        })
        client.player.on('channelEmpty', (message) => {
            setTimeout(function onTimeOut() {
                message.channel.send(`:zzz: Left channel due to inactivity.`)
            }, 90000)
        })
        client.player.on('error', (error, message) => {
            message.reply(`An error occured: ${error}`)
        })
    }
}