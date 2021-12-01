const Discord = require('discord.js');
module.exports = {
	name: 'rank',
	group: 'utility',
	usage: `rank (optional user)`,
	description: 'Find your rank!',
	async execute(message, args, client) {
		let author = message.author
		if (args !== '' || null || undefined && message.mentions.users.first() !== undefined) {
			if (message.mentions.users.first().bot == true) return message.reply('that is not a user.')
			author = message.mentions.users.first()
		}
		const count = await client.pool.db("Tubb").collection("servers").find({ id: message.guild.id }).toArray()
		if (count[0].leveling == 0) return message.reply('leveling is off for your server, ask an admin to turn it on.')
		const user = await client.pool.db("Tubb").collection("users").find({ id: author.id, guild: message.guild.id }).toArray()
		const server = await client.pool.db("Tubb").collection("users").find({ guild: message.guild.id }).sort({ xp: -1 }).toArray()
		const dashes = [];
		for (let i = 0; i < 20; i++) dashes.push('▬');
		var percentage = Math.floor((user[0].xp / user[0].required) * 100);
		var progress = Math.round(percentage / 5);
		dashes.splice(progress, 1, '/');
		const everyone = [];
		for (let i = 0; i < server.length; i++) everyone.push(server[i].id);
		var rank = everyone.indexOf(user[0].id) + 1;
		const embed = new Discord.MessageEmbed()
			.setTitle(`Rank of \`${author.username}#${author.discriminator}\` in \`${message.guild.name}\`!`)
			.setThumbnail(author.avatarURL())
			.setColor('#DC143C')
			.addField('Level', user[0].level, true)
			.addField('Total exp', user[0].xp, true)
			.addField('Exp needed', user[0].required, true)
			.addField('Rank', rank, true)
			.setDescription(`Here's a cool line representing your level \n ${user[0].level} ${dashes.join("")} ${(user[0].level + 1)}`)
		message.channel.send(embed)
	}
}