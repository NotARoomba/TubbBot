const Discord = require('discord.js')
const commandBase = require('@root/commands/command-base')
const client = new Discord.Client()

module.exports = {
    commands: 'kick',
    maxArgs: 1,
    expectedArgs: "[Target user's @]",
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments, text) => {
       
        const tag = `<@${member.id}>`

    
      const target = mentions.users.first()
      if (target) {
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.kick()
        message.channel.send(`${tag} That user has kicked`)
      } else {
        message.channel.send(`${tag} Please specify someone to kick.`)
      }
    }
}