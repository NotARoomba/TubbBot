
const serverSchema = require('@schemas/server-schema')
const commandBase = require('@root/commands/command-base')


module.exports = {
  commands: 'prefix',
  permissionError: 'You must be an admin to run this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments, text) => {
    const { guild, content } = message
    const cache = {}
    let prefix = content

    const split = prefix.split(' ')
 
    if (split.length < 2) {
      return
    }

    split.shift()
    prefix = split.join(' ')
    cache[guild.id] = [prefix]
   
  
     
    
        await serverSchema.findOneAndUpdate(
          {
            _id: guild.id,
          },
          {
            _id: guild.id,
            prefix,
          },
          {
            upsert: true,
          }
        )

        //message.reply(`The prefix for this bot is now ${prefix}`)

        
        commandBase.updateCache(guild.id, prefix)
      
    
  },
}