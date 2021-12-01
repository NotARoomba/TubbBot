const Discord = require('discord.js');
module.exports = {
	name: 'invites',
	group: 'utility',
	usage: `invites (optional user)`,
	description: `Responds with information on a user's invites.`,
	async execute(message, args) {
		let user = message.author
		if (args !== '' || null || undefined && message.mentions.users.first() !== undefined) {
			if (message.mentions.users.first().bot == true) return message.reply('that is not a user.')
			user = message.mentions.users.first()
		}
		message.guild.fetchInvites().then(invites => {
			const userInvites = invites.array().filter(o => o.inviter.id === user.id);
			var userInviteCount = 0;
			var fakeInviteCount = 0;
			for (var i = 0; i < userInvites.length; i++) {
				var invite = userInvites[i];
				userInviteCount += invite['uses'];
			}
			for (var i = 0; i < userInvites.length; i++) {
				var invite = userInvites[i];
				fakeInviteCount += invite['uses'] == 0 ? 1 : 0
			}
			const embed = new Discord.MessageEmbed()
				.setTitle(`:incoming_envelope: Invites`)
				.setDescription(`${user} has ${userInviteCount - fakeInviteCount} invites (${fakeInviteCount} fake, ${userInviteCount} total).`)
			message.channel.send(embed)
		})
	}
}
