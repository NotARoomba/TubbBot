const welcomeSchema = require('@schemas/welcome-schema')
const mongo = require('@util/mongo')

const cache = new Map()

const loadData = async () => {
  const results = await welcomeSchema.find()

  for (const result of results) {
    cache.set(result._id, result.channelId)
  }
}
loadData()

module.exports = {
    commands: 'setwelcome',
    minArgs: 1,
  maxArgs: 1,
  requiredPermissions: ['ADMINISTRATOR'],
  callback: async (message) => {
    const { guild, channel, content } = message

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
    
        }finally {
            mongoose.connection.close()
          }
        });

    

    cache.set(guild.id, channel.id, text)

    message.reply('Welcome channel set!')
  },
}

module.exports.getChannelId = (guildId) => {
  return cache.get(guildId)
}