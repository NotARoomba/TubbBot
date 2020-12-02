const serverSchema = require('@schemas/server-schema')
const mongo = require('@util/mongo')
const config = require('@root/config.json');
const Discord = require('discord.js');
module.exports = {
    commands: ['setimage', 'si'],
    permissionError: 'You must be an admin to run this command.',
  requiredPermissions: 'ADMINISTRATOR',
  callback: async (message) => {
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: setimage 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
    const { guild, channel, content } = message
    const cache = {}
    let image = content

    const split = image.split(' ')
 try {
    if (split.length < 2) {
      channel.send('Please provide a welcome image')
      return
    }
     
  
    split.shift()
    image = split.join(' ')
    cache[guild.id] = [image]
    
        
    
    
    
    await serverSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        image,
      },
      {
        upsert: true,
      }
    )
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send('UPDATED IMAGE DATABASE')
        

    

    message.reply('Welcome image set! Please make sure that it is the proper link for your image.')
  } catch (error) {
    console.error(error);
    return message.reply(error.message).catch(console.error);
  }
}
} 
