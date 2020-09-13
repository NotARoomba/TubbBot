const Discord = require('discord.js')
const commandBase = require('@root/commands/command-base')
const client = new Discord.Client()

module.exports = {
    commands: 'ban',
    maxArgs: 1,
    expectedArgs: "[Target user's @]",
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments) => {
        
        const tag = `<@${member.id}>`
        
    const target = mentions.users.first()
      if (target) {
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.ban()
        message.channel.send(`${tag} That user has been`)
      } else {
        message.channel.send(`${tag} Please specify someone to ban.`)
      } 

    }
}