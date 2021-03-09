const Discord = require('discord.js');
const { toTitleCase } = require('../../function');
module.exports = {
    name: 'user',
    group: 'utility',
    usage: `user (mention a user)`,
    description: `Gets a user's info.`,
    async execute(message) {
        let user = message.mentions.users.first();
        try {
            if (user == undefined) user = message.author
            const embed = new Discord.MessageEmbed()
                .setTitle(`Information on ${user.username}#${user.discriminator}`)
                .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
                .addField(`Created At`, `${user.createdAt}`, true)
                .addField(`Bot`, `${user.bot}`, true)
                .addField(`ID`, `${user.id}`, true)
                .addField(`Avatar Url`, `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })}`, true)
            user.presence.status == 'offline' ?
                embed.addField(`Activity`, `${toTitleCase(user.presence.status)}`, true)
                : embed.addField(`Activity`, `${toTitleCase(user.presence.status)}`, true)
                    .addField(`Status`, `${user.presence.activities.length == 0 ? `Nothing` : (user.presence.activities[0].type == 'CUSTOM_STATUS' ? `${user.presence.activities[0].state}` : `${toTitleCase((user.presence.activities[0].type).toLowerCase())} **${user.presence.activities[0].name}**`)}`, true)
                    .addField(`Device`, `${toTitleCase(Object.getOwnPropertyNames(user.presence.clientStatus)[0])}`, true)
            message.channel.send(embed)
        } catch (err) {
            console.log(err)
            return message.reply(`an error occured.`)
        }
    }
}