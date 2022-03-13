const { MessageEmbed } = require('discord.js')
const { getLyrics, getSong } = require('genius-lyrics-api');
module.exports = {
	name: 'lyrics',
	group: 'music',
	usage: 'lyrics (optional: song name)',
	aliases: ['ly'],
	description: 'Get the lyrics for the currently playing song or query!',
	async execute(message, songName) {
		if (!message.guild.musicData.isPlaying && songName == '') return message.reply(`please play a song or input your search query.`)
    let songArtist;
		if (songName == '' && message.guild.musicData.isPlaying) {
			const track = message.guild.musicData.nowPlaying
			songName = track.title
      artist = track.artist
		}
		songName = songName.replace(/ *\([^)]*\) */g, '');
		songName = songName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    songArtist = songName.replace(/ *\([^)]*\) */g, '');
		songArtist = songName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
		const options = {
			apiKey: process.env.GENIUS_LYRICS_API,
			title: songName,
			artist: songArtist,
			optimizeQuery: true
		};
		const sentMessage = await message.channel.send(':mag: :notes: Searching for lyrics!');
		getLyrics(options).then((lyrics) => {
      try {
			if (lyrics.length > 4095) {
				message.channel.send('Lyrics are too long to be returned in a message embed!');
				return;
			}
			if (lyrics.length < 2048 - songName.length) {
				const lyricsEmbed = new MessageEmbed()
					.setTitle(songName)
					.setColor('#dbc300')
					.setDescription(lyrics.trim())
					.setFooter('Provided by genius.com');
				return sentMessage.edit('', lyricsEmbed);
			} else {
				// 2048 < lyrics.length < 4096
				const firstLyricsEmbed = new MessageEmbed()
					.setTitle(songName)
					.setColor('#dbc300')
					.setDescription(lyrics.slice(0, 2048 - songName.length))
					.setFooter('Provided by genius.com');
				const secondLyricsEmbed = new MessageEmbed()
					.setColor('#dbc300')
					.setDescription(lyrics.slice(2048, lyrics.length))
					.setFooter('Provided by genius.com');
				sentMessage.edit('', firstLyricsEmbed);
				message.channel.send(secondLyricsEmbed);
				return;
			}
    } catch (err) {
         message.channel.send("There are no lyrics for that song!");
    }
		});
	}
}