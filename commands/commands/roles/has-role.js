const Discord = require('discord.js')
const client = new Discord.Client()


module.exports = {
    commands: 'hasrole',
    minArgs: 2,
    expectedArgs: "<Target user's @> <The role name>",
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments) => {
      const targetUser = message.mentions.users.first()
      if (!targetUser) {
        
        const tgtusrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription('Please specify someone to give a role to.')

        message.reply(tgtusrEmbed)
        return
      }
  
      arguments.shift()
  
      const roleName = arguments.join(' ')
      const { guild } = message
  
      const role = guild.roles.cache.find((role) => {
        return role.name === roleName
      })
      if (!role) {
        
        const rleusrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`There is no role with the name "${roleName}"`)

        
        message.reply(rleusrEmbed)
        return
      }
  
      const member = guild.members.cache.get(targetUser.id)
  
      if (member.roles.cache.get(role.id)) {
        
        const rleyesEmbed = new Discord.MessageEmbed()
            .setColor('#228B22')
            .setTitle(`Success`)
            .setDescription(`That user has the ${roleName} role`)

        
        message.reply(rleyesEmbed)
      } else {
        
        const rlenoEmbed = new Discord.MessageEmbed()
            .setColor('#228B22')
            .setTitle(`Success`)
            .setDescription(`That user does not have the ${roleName} role`)
        
        message.reply(rlenoEmbed)
      }
    },
  }