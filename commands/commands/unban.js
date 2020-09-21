const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {
        
        const member = args[0];
         if (!member) {
             return message.reply(`Please enter a id!`)
        }

        try {
            message.guild.fetchBans().then(bans => {
                message.guild.members.unban(member)
            })
            await message.reply(`${member} has been unbanned!`)
        } catch (e) {
            return message.reply(`An error occured!`)
        }
    }
}