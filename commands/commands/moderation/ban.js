const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'ban',
    description: 'BAN HAMMER TIME!!!',
    maxArgs: 1,
    expectedArgs: "<Target user's @>",
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: (message) => {
        const { member, mentions, arguments} = message

        const tag = `<@${member.id}>`
        
        const target = mentions.users.first()
      if (target) {
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.ban()

        const banyesEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`${tag} That user has been banned`)


        message.channel.send(banyesEmbed)
      } else {
        
        const banerrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`${tag} Please specify someone to ban`)
        
        message.channel.send(banerrEmbed)
      }
    }
}