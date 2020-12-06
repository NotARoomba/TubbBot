const streamSchema = require('@schemas/stream-schema')
module.exports = {
    commands: ['setstreamer', 'ss'],
    permissionError: 'You must be an admin to run this command.',
    requiredPermissions: 'ADMINISTRATOR',
  callback: async (message) => {
    const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        webhookClient.send(`Command: setstreamer 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
    const { guild, channel, content } = message
    const cache = {}
    let streamer = content

    const split = streamer.split(' ')
 try {
    if (split.length < 2) {
      channel.send('Please provide a streamer from Twitch')
      return
    }
     
  
    split.shift()
    streamer = split.join(' ')
    cache[guild.id] = [streamer]
    
        
    
    
  
    await streamSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        streamer,
      },
      {
        upsert: true,
      }
    )
    const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        webhookClient.send('UPDATED STREAMER DATABASE')
       
    

    message.reply(`Streamer set. Please make sure that it is a streamer's username`)
  } catch (error) {
    console.error(error);
    return message.reply(error.message).catch(console.error);
  }
}
} 