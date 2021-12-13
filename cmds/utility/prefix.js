module.exports = {
	name: 'prefix',
	group: 'utility',
	usage: `prefix (prefix)`,
	permissions: ['MANAGE_GUILD'],
	description: 'Changes the prefix for your server.',
	async execute(message, args, client) {
		if (args.length === 0 || args === "") return message.reply('that is not a valid prefix.')
		await client.pool.db("Tubb").collection("servers").updateOne({ id: message.guild.id }, { $set: { prefix: args } })
		message.channel.send(`Prefix updated to \`${args}\``)
	}
}