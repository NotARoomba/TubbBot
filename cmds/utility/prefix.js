const Discord = require('discord.js');
module.exports = {
    name: 'prefix',
    group: 'utility',
    usage: `prefix (prefix)`,
    description: 'Changes the prefix for your server.',
    async execute(message, args, client) {
        if (args.length === 0 || args === "") return message.reply('that is not a valid prefix.')
        const [prefix] = await client.pool.query(`SELECT * FROM servers WHERE id = ${message.guild.id}`);
        if (prefix[0].prefix) {
            await client.pool.query(`UPDATE servers SET prefix = '${args}' WHERE id = ${message.guild.id}`);
            message.channel.send(`Prefix updated to \`${args}\``)
        } else {
            await pool.query(`INSERT INTO servers (id, prefix) VALUES ('${message.guild.id}','${args}')`)
            message.channel.send(`Prefix changed to \`${args}\``)
        }
    }
}