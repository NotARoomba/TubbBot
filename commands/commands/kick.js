const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'kick',
    callback: (message) => {
        const { member, mentions} = message

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