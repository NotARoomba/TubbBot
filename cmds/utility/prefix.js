const Discord = require('discord.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.DBUSER}:${process.env.DBPASS}@freedb.tech:3306/${process.env.DBNAME}`)

module.exports = {
    name: 'prefix',
    description: 'Changes the prefix for your server.',
    async execute(message, args) {
        const Prefix = sequelize.define('Prefix', {
            guild: Sequelize.STRING,
            prefix: Sequelize.STRING
        })
        Prefix.sync();
        const prefix = await Prefix.findOne({ where: { guild: message.guild.id } });
        if (prefix) {
            await Prefix.update({ prefix: args }, { where: { guild: message.guild.id } });
            message.channel.send(`Prefix updated to \`\`\`${args}\`\`\``)
        } else {
            const prefix = await Prefix.create({
                guild: message.guild.id,
                prefix: args,
            });
            message.channel.send(`Prefix changed to \`\`\`${prefix.prefix}\`\`\``)
        }
    }
}