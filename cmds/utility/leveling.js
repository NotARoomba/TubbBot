module.exports = {
    name: 'leveling',
    group: 'utility',
    usage: `leveling (true or false)`,
    permissions: ['ADMINISTRATOR'],
    description: 'Changes the prefix for your server.',
    async execute(message, args, client) {
        if (!args == 'true' || !args == 'false') return message.reply('that is not true or false.')
        args = args == "true" ? 1 : 0
        await client.pool.query(`UPDATE servers SET leveling = '${args}' WHERE id = ${message.guild.id}`);
        message.channel.send(`Leveling updated to \`${args == 1 ? true : false}\``)
    }
}