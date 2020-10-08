const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'kick',
    description: 'Kicks someone somewhere?',
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
        targetMember.kick()

        const kikyesEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`${tag} That user has been kicked`)


        message.channel.send(kikyesEmbed)
      } else {
        
        const kikerrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`${tag} Please specify someone to kick`)
        
        message.channel.send(kikerrEmbed)
      }
    }
}