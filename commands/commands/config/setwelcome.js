module.exports = {
    commands: ['setwelcome', 'sw'],
    permissionError: 'You must be an admin to run this command.',
    requiredPermissions: 'ADMINISTRATOR',
  callback: async (message) => {
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: setwelcome 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
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
   
    await serverSchema.findOneAndUpdate(
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
        webhookClient.send('UPDATED DATABASE')
       
    

    message.reply('Welcome message and channel set!')
  },
}

