module.exports = {
    name: 'leveling',
    group: 'utility',
    usage: `leveling (true or false)`,
    description: 'Changes the prefix for your server.',
    async execute(message, args, client) {
        if (!args == 'true' || !args == 'false') return message.reply('that is not true or false.')
        args = args == "true" ? 1 : 0
        const [leveling] = await client.pool.query(`SELECT leveling FROM servers WHERE id = ${message.guild.id}`);
        if (leveling[0].leveling) {
            await client.pool.query(`UPDATE servers SET leveling = '${args}' WHERE id = ${message.guild.id}`);
            message.channel.send(`Leveling updated to \`${args == 1 ? true : false}\``)
        } else {
            await client.pool.query(`INSERT INTO servers (id, leveling) VALUES ('${message.guild.id}','${args}')`)
            message.channel.send(`Leveling changed to \`${args == 1 ? true : false}\``)
        }
    }
}