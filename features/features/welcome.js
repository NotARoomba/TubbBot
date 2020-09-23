const Discord = require('discord.js')
const client = new Discord.Client()
const mongo = require('@util/mongo')
const command = require('@util/command')
const welcomeSchema = require('@schemas/welcome-schema')

  
  module.exports = (client) => {
    const channelId = '757771111374258176'
    const cache = {} // guildId: [channelId, text]
    const channelId = '757771111374258176'
  
    command(client, 'setwelcome', async (message) => {
      const { member, channel, content, guild } = message
  
      if (!member.hasPermission('ADMINISTRATOR')) {
        channel.send('You do not have permission to run this command.')
        return
      }
  
      let text = content
  
      const split = text.split(' ')
  
      if (split.length < 2) {
        const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#8B0000')
            .setTitle(`Welcome`)
            .setDescription(`Welcome to this Server, ${member}! Please read #rules . Thank you for joining this server and we hope you have a good time!
            (Btw -help)`)
        
        channel.send(welcomeEmbed)
        return
      }
  
      split.shift()
      text = split.join(' ')
  
      cache[guild.id] = [channel.id, text]
  
      await mongo().then(async (mongoose) => {
        try {
          await welcomeSchema.findOneAndUpdate(
            {
              _id: guild.id,
            },
            {
              _id: guild.id,
              channelId: channel.id,
              text,
            },
            {
              upsert: true,
            }
          )
        } finally {
          mongoose.connection.close()
        }
      })
    })
  
    const onJoin = async (member) => {
      const { guild } = member
  
      let data = cache[guild.id]
  
      if (!data) {
        console.log('FETCHING FROM DATABASE')
  
        await mongo().then(async (mongoose) => {
          try {
            const result = await welcomeSchema.findOne({ _id: guild.id })
  
            cache[guild.id] = data = [result.channelId, result.text]
          } finally {
            mongoose.connection.close()
          }
        })
      }
  
      const channelId = data[0]
      const text = data[1]

      const channel = guild.channels.cache.get(channelId)
      channel.send(text.replace(/<@>/g, `<@${member.id}>`))
    }
  
    command(client, 'simjoin', (message) => {
      onJoin(message.member)
    })
  
    client.on('guildMemberAdd', (member) => {
      onJoin(member)
    })
  }
  client.on('guildMemberAdd', member => {
      
  
            
})
