module.exports = {
	name: 'leveling',
	group: 'utility',
	usage: `leveling (true or false)`,
	permissions: ['MANAGE_GUILD'],
	description: 'Changes the leveling status for your server.',
	async execute(message, args, client) {
		if (args == "" || !args == 'true' || !args == 'false') {
			return message.reply('that is not true or false.')
		}
		args = args == "true" ? 1 : 0
		await client.pool.db("Tubb").collection("servers").updateOne({ id: message.guild.id }, { $set: { leveling: args } })
		message.channel.send(`Leveling updated to \`${args == 1 ? true : false}\``)
	}
}