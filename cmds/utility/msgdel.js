module.exports = {
	name: 'messagedelete',
	group: 'utility',
	usage: `msgdel (optional: amount of messages)`,
	aliases: ['msgdel'],
	permissions: ['MANAGE_MESSAGES'],
	permission: ['MANAGE_MESSAGES'],
	description: 'Mass (message) Genocide',
	async execute(message, count) {
		try {
			const deleteCount = parseInt(count, 10);
			await message.channel.bulkDelete(deleteCount + 1 || 100)
		} catch (err) {
			if (err.code == 60003) return message.reply(`You need 2FA enabled on your account.`)
			console.log(err)
			return message.reply(`There are some messages older than two weeks that can't be deleted.`);
		}
	}
}