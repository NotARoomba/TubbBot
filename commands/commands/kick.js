const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'kick',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'You must be an administrator to use this command.',
    permissions: ADMINISTRATOR,
    callback: (message) => {
        const { member, mentions, arguments} = message

        const tag = `<@${member.id}>`
        
        const target = mentions.users.first()
      if (target) {
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.kick()
        message.channel.send(`${tag} That user has been kicked`)
      } else {
        message.channel.send(`${tag} Please specify someone to kick.`)
      }
    }
}