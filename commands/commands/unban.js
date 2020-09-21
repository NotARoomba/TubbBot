const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'unban',
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: (message) => {
        
        
      if (target) {
        let userID = args[0]
      msg.guild.fetchBans().then(bans=> {
      if(bans.size == 0) return 
      let bUser = bans.find(b => b.user.id == userID)
      if(!bUser) return
      msg.guild.members.unban(bUser.user)
})

        const unbyesEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`${tag} That user has been unbanned`)


        message.channel.send(unbyesEmbed)
      } else {
        
        const unberrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`${tag} Please specify someone to unban.`)
        
        message.channel.send(unberrEmbed)
      }
    }
}