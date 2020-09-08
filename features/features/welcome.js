const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = (client) => {
    const channelId = '750766854360006676' // welcome channel
    const targetChannelId = '750556623348564038'  // rules and info
    const targetChannelId2 = '751559736096456885'
    
    client.on('guildMemberAdd', (member) => {
          const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#8B0000')
            .setTitle(`Welcome`)
            .setDescription(`Welcome to Corona, ${member}! Once you join, you will be infected with the corona virus. There are 3 stages, diagnosed, recovering, and recovered. Once recovered you will be free just to hang out on this server and play, but until then, you have a hard battle. After you recovered, you will be vaccinated which will make sure you're never infected ever again. The way you level up and get through the virus is simply by just hanging out and "spreading" the word about this server! Please read ${member.guild.channels.cache.get(targetChannelId, 'and' ,targetChannelId2).toString()}. Goodluck and may the odds be ever in your favor.(Btw -help)`)
    
        const channel = member.guild.channels.cache.get(channelId)
        channel.send(welcomeEmbed)
      })
  }