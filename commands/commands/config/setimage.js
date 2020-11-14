const serverSchema = require('@schemas/server-schema')
const mongo = require('@util/mongo')


module.exports = {
    commands: ['setimage', 'si'],
    permissionError: 'You must be an admin to run this command.',
  requiredPermissions: 'ADMINISTRATOR',
  callback: async (message) => {
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
    console.log('UPDATED IMAGE DATABASE')
        

    

    message.reply('Welcome image set! Please make sure that it is the proper link for your image.')
  } catch (error) {
    console.error(error);
    return message.reply(error.message).catch(console.error);
  }
}
} 
