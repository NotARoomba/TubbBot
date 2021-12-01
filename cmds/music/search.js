const Discord = require('discord.js');
const Youtube = require('simple-youtube-api')
const youtube = new Youtube(process.env.GOOGLE);
module.exports = {
	name: 'search',
	group: 'music',
	usage: 'search (what you want to search for)',
	description: 'Search Youtube for a song!',
	async execute(message, query) {
		const videos = await youtube.searchVideos(query, 10)
		if (videos.length < 5 || !videos) {
			return message.channel.send(`I had some trouble finding what you were looking for, please try again or be more specific.`);
		}
		const vidNameArr = [];
		for (let i = 0; i < videos.length; i++) {
			vidNameArr.push(
				`${i + 1}: [${videos[i].title
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&apos;/g, "'")
					.replace(/&quot;/g, '"')
					.replace(/&amp;/g, '&')
					.replace(/&#39;/g, "'")}](http://youtu.be/${videos[i].id})`
			);
		}
		const embed = new Discord.MessageEmbed()
			.setColor('#FFED00')
			.setTitle(`:mag: Search Results!`)
			.addField(':notes: Result 1', vidNameArr[0])
			.setURL(`http://youtu.be/${videos[0].id}`)
			.addField(':notes: Result 2', vidNameArr[1])
			.addField(':notes: Result 3', vidNameArr[2])
			.addField(':notes: Result 4', vidNameArr[3])
			.addField(':notes: Result 5', vidNameArr[4])
			// .addField(':notes: Result 6', vidNameArr[5])
			// .addField(':notes: Result 7', vidNameArr[6])
			// .addField(':notes: Result 8', vidNameArr[7])
			// .addField(':notes: Result 9', vidNameArr[8])
			// .addField(':notes: Result 10', vidNameArr[9])
			.setThumbnail(videos[0].thumbnails.high.url)
		message.channel.send(embed)
	}
}