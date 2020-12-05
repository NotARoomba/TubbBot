
const { MessageAttachment } = require('discord.js')
module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    const { guild } = member
    const cache = {}


    let data = cache[guild.id]

    if (!data) {
      console.log('FETCHING FROM DATABASE')

      
          const result = await serverSchema.findOne({ _id: guild.id })

          cache[guild.id] = data = [result.channelId, result.text, result.image, result.color]
      
    }
    try {
    const image = data[2]
    const color = data[3]
    const canvas = Canvas.createCanvas(700, 300)
    const ctx = canvas.getContext('2d')

    const background = await Canvas.loadImage(image || 'https://spacenews.com/wp-content/uploads/2018/05/24359364107_152b0152ff_k.jpg')
    let x = 0
    let y = 0
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    const pfp = await Canvas.loadImage(
      member.user.displayAvatarURL({
        format: 'png',
      })
    )
    x = canvas.width / 2
    y = 25
    ctx.drawImage(pfp, x, y, 100, 100)

    ctx.fillStyle = color || '#ffffff'
    ctx.font = '35px sans-serif'
    let bannertext = `Welcome ${member.user.tag}`
    x = canvas.width / 2 - ctx.measureText(bannertext).width / 2
    ctx.fillText(bannertext, x, 60 + pfp.height)

    ctx.font = '30px sans-serif'
    bannertext2 = `Member #${guild.memberCount}`
    x = canvas.width / 2 - ctx.measureText(bannertext2).width / 2
    ctx.fillText(bannertext2, x, 100 + pfp.height)

    const attachment = new MessageAttachment(canvas.toBuffer())
    const channelId = data[0]
    const text = data[1]
    const channel = guild.channels.cache.get(channelId)
    channel.send(text.replace(/<@>/g, `<@${member.id}>`) || 'Welcome to this server! Look at my process.env commands and set up your server!')
    channel.send(attachment)
    
    } catch (error) {
      console.log(error);

    }
  })
}
    