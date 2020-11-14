const mongo = require('@util/mongo')
const serverSchema = require('@schemas/server-schema')
const commandBase = require('@root/commands/command-base')

module.exports = {
  commands: ['setprefix', 'sp'],
  permissionError: 'You must be an admin to run this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments, text) => {
    const { guild, channel, content } = message
    const cache = {}
    let prefix = content

    const split = prefix.split(' ')
       
    if (split.length < 2) {
      channel.reply('Please provide a prefix')
      return
    }
     
  
    split.shift()
    prefix = split.join(' ')
    cache[guild.id] = [prefix]
        await serverSchema.findOneAndUpdate(
          {
            _id: guildId,
          },
          {
            _id: guildId,
            prefix,
          },
          {
            upsert: true,
          }
        )

        message.reply(`The prefix for this bot is now ${prefix}`)

        
        commandBase.updateCache(guildId, prefix)
      
    
  },
}