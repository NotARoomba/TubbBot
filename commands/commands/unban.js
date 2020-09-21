const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async(client, message, args) => {
        const { member, mentions, arguments} = message

        

        if (!member) {
             return message.channel.reply(`Please enter a id!`)
        }

        try {
            message.guild.fetchBans().then(bans => {
                message.guild.members.unban(member)
            })
            await message.channel.reply(`${member} has been unbanned!`)
        } catch (e) {
            return message.channel.reply(`An error occured!`)
        }
    }
}