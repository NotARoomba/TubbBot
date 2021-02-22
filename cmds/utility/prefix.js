const Discord = require('discord.js');

module.exports = {
    name: 'prefix',
    group: 'utility',
    description: 'Changes the prefix for your server.',
    async execute(message, args, client) {
        if (args.length === 0 || args === "") return message.reply('that is not a valid prefix.')

        const prefix = await client.pool.query(`SELECT * FROM prefixes WHERE guild = ${message.guild.id}`);
        if (prefix) {
            await client.pool.query(`UPDATE prefixes SET prefix = '${args}' WHERE guild = ${message.guild.id}`);
            message.channel.send(`Prefix updated to \`${args}\``)
        } else {
            await pool.query(`INSERT INTO prefixes(guild, prefix) VALUES ('${message.guild.id}','${args}')`)
            message.channel.send(`Prefix changed to \`${args}\``)
        }
    }
}