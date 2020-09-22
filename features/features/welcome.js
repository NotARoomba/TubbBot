const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = (client) => {
    const channelId = '757771111374258176'  // welcome channel
    const rules = '757769773148012655'  // rules and info
    //const roles = '751559736096456885'
    
    client.on('guildMemberAdd', (member) => {
          const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#8B0000')
            .setTitle(`Welcome`)
            .setDescription(`Welcome to this Server, ${member}! Please read ${member.guild.channels.cache.get(rules).toString()} and ${member.guild.channels.cache.get(roles).toString()}. Please wait until you are allowed through and we hope you have a good time!
            (Btw -help)`)
    
        const channel = member.guild.channels.cache.get(channelId)
        channel.send(welcomeEmbed)
      })
}