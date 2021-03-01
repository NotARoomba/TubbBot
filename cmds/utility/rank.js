const Discord = require('discord.js');
module.exports = {
    name: 'rank',
    group: 'utility',
    usage: `rank (optional user)`,
    description: 'Find your rank!',
    async execute(message, args, client) {
        let author = message.author
        if (args !== '' || null || undefined && message.mentions.users.first() !== undefined) {
            if (message.mentions.users.first().bot) return message.reply('that is not a user.')
            author = message.mentions.users.first()
        }
        const [count] = await client.pool.query(`SELECT COUNT(*) FROM users WHERE id = ${author} AND guild = ${message.guild.id};`)
        if (count[0][Object.keys(count[0])] == 0) return message.reply('leveling is off for your server, ask an admin to turn it on.')
        const [user] = await client.pool.query(`SELECT * FROM users WHERE id = ${author.id} AND guild = ${message.guild.id};`)
        const [server] = await client.pool.query(`SELECT * FROM users WHERE guild = ${message.guild.id} ORDER BY exp DESC`)
        const dashes = [];
        for (let i = 0; i < 20; i++) dashes.push('▬');
        var percentage = Math.floor((user[0].exp / user[0].required) * 100);
        var progress = Math.round(percentage / 5);
        dashes.splice(progress, 1, '/');
        const everyone = [];
        for (let i = 0; i < server.length; i++) everyone.push(server[i].id);
        var rank = everyone.indexOf(user[0].id) + 1;
        const embed = new Discord.MessageEmbed()
            .setTitle(`Rank for ${author.username}#${author.discriminator} in \`${message.guild.name}\`!`)
            .setThumbnail(author.avatarURL())
            .setColor('#DC143C')
            .addFields({
                name: 'Level',
                value: user[0].level,
            },
                {
                    name: 'Total exp',
                    value: user[0].exp,
                },
                {
                    name: 'Exp needed',
                    value: user[0].required,
                },
                {
                    name: 'Rank',
                    value: rank,
                })
            .setDescription(`Here's a line representing your level \n ${user[0].level} ${dashes.join("")} ${(user[0].level + 1)}`)
        message.channel.send(embed)
    }
}