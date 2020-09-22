const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = (client) => {
    // welcome channel
    const rules = '757769773148012655'  // rules and info
    //const roles = '751559736096456885'
    
    client.on("guildMemberAdd", member => {
      const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome', 'welcome-channel')
          const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#8B0000')
            .setTitle(`Welcome`)
            .setDescription(`Welcome to ${server}, ${member}! Please read ${member.guild.channels.cache.get(rules).toString()}. Thank you for joining this server and we hope you have a good time!
            (Btw -help)`)
  
        welcomeChannel.send(welcomeEmbed)
      })
}