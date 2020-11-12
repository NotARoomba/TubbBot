const welcomeSchema = require('@schemas/welcome-schema')
const mongo = require('@util/mongo')

module.exports = {
    commands: ['setwelcome', 'sw'],
  requiredPermissions: ['ADMINISTRATOR'],
  callback: async (message) => {
    const { guild, channel, content } = message
    const cache = {}
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
    console.log('UPDATED DATABASE')
        }finally {
            mongoose.connection.close()
          }
        });

    

    message.reply('Welcome channel set!')
  },
}

