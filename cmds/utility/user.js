const Discord = require('discord.js');
const { toLowerCase, toLocaleLowerCase } = require('ffmpeg-static');
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
                .addFields([
                    { name: `Created At`, value: `${user.createdAt}` },
                    { name: `Bot`, value: `${user.bot}` },
                    { name: `ID`, value: `${user.id}` },
                    { name: `Avatar Url`, value: `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })}` },
                ])
                .addFields(user.presence.status == 'offline' ? [
                    { name: `Activity`, value: `${toTitleCase(user.presence.status)}` },
                ] : [{ name: `Activity`, value: `${toTitleCase(user.presence.status)}` },
                { name: `Status`, value: `${user.presence.activities.length == 0 ? `Nothing` : (user.presence.activities[0].type == 'CUSTOM_STATUS' ? `${user.presence.activities[0].state}` : `${toTitleCase((user.presence.activities[0].type).toLowerCase())} **${user.presence.activities[0].name}**`)}` },
                { name: `Device`, value: `${toTitleCase(Object.getOwnPropertyNames(user.presence.clientStatus)[0])}` }
                ])
            message.channel.send(embed)
        } catch (err) {
            console.log(err)
            return message.reply(`an error occured.`)
        }
    }
}