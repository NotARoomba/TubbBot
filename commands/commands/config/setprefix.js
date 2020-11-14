
const serverSchema = require('@schemas/server-schema')
const commandBase = require('@root/commands/command-base')

module.exports = {
  commands: ['setprefix', 'sp'],
  permissionError: 'You must be an admin to run this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments, text) => {
    
    const guildId = message.guild.id
    const prefix = arguments[0]

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