const { prefix } = require('./config.json')

module.exports = (client, aliases, callback) => {
  if (typeof aliases === 'string') {
    aliases = [aliases]
  }

  client.on('message', (message) => {
    const { content } = message

    aliases.forEach((alias) => {
      
      await mongo().then((mongoose) => {
        try {
          console.log('Connected to mongo!')
        } finally {
          mongoose.connection.close()
        }
      })
      
      const command = `${prefix}${alias}`

      if (content.startsWith(`${command} `) || content === command) {
        console.log(`Running the command ${command}`)
        callback(message)
      }
    })
  })
}