const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = (member, message) => {
    client.on('guildMemberAdd', (member) => {
      const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#8B0000')
            .setTitle(`Welcome`)
            .setDescription(`Welcome to this Server, ${member}! Please read #rules . Thank you for joining this server and we hope you have a good time!
            (Btw -help)`)
  
            member.guild.channels.get('757771111374258176').send(welcomeEmbed)
      })
}