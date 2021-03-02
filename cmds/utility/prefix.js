module.exports = {
    name: 'prefix',
    group: 'utility',
    usage: `prefix (prefix)`,
    permissions: ['ADMINISTRATOR'],
    description: 'Changes the prefix for your server.',
    async execute(message, args, client) {
        if (args.length === 0 || args === "") return message.reply('that is not a valid prefix.')
        await client.pool.query(`UPDATE servers SET prefix = '${args}' WHERE id = ${message.guild.id}`);
        message.channel.send(`Prefix updated to \`${args}\``)
    }
}