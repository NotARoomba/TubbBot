const welcomeSchema = require('@schemas/welcome-schema')
const mongo = require('@util/mongo')
const { endsWith } = require('ffmpeg-static')

module.exports = {
    commands: 'setbackground',
  requiredPermissions: ['ADMINISTRATOR'],
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
    
        
    
    
    await mongo().then(async (mongoose) => {
        try {
    await welcomeSchema.findOneAndUpdate(
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
        }finally {
            mongoose.connection.close()
          }
        });

    

    message.reply('Welcome image set! Please make sure that it is a proper image link.')
  } catch (error) {
    console.error(error);
    return message.reply(error.message).catch(console.error);
  }
}
} 
