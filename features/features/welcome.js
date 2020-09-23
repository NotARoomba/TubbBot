const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = (member, message) => {
    const rules = '757769773148012655'  // rules and info
    //const roles = '751559736096456885'
    const welcomeChannel = member.guild.channels.cache.get(`757771111374258176`)
    client.on('guildMemberAdd', (member) => {
          const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#8B0000')
            .setTitle(`Welcome`)
            .setDescription(`Welcome to this Server, ${member}! Please read #rules . Thank you for joining this server and we hope you have a good time!
            (Btw -help)`)
  
            welcomeChannel.send(welcomeEmbed)
      })
}