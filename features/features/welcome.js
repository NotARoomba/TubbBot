const mongo = require('@util/mongo')
const command = require('@util/command')
const welcomeSchema = require('@schemas/welcome-schema')

module.exports = (client) => {
  !setwelcome 

  const welcomeEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Welcome`)
    .setDescription(`Welcome to Corona, ${member}! Once you join, you will be infected with the corona virus. There are 3 stages, diagnosed, recovering, and recovered. Once recovered you will be free just to hang out on this server and play, but until then, you have a hard battle. After you recovered, you will be vaccinated which will make sure you're never infected ever again. The way you level up and get through the virus is simply by just hanging out and "spreading" the word about this server! Please read #rules and #roles. Goodluck and may the odds be ever in your favor.(Btw -help)`)

channel.send(welcomeEmbed);

  const cache = {} // guildId: [channelId, text]

  command(client, 'setwelcome', async (message) => {
    const { member, channel, content, guild } = message

    if (!member.hasPermission('ADMINISTRATOR')) {
      channel.send('You do not have permission to run this command.')
      return
    }

    let text = content

    const split = text.split(' ')

    if (split.length < 2) {
      channel.send('Please provide a welcome message')
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