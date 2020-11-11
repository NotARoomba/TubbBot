const Canvas = require('canvas')
const { MessageAttachment } = require('discord.js')
const path = require('path')
const { getChannelId } = require('@commands/config/setwelcome')
const mongo = require('@util/mongo')
//const cache = require('@commands/config/setwelcome')
const welcomeSchema = require('@schemas/welcome-schema')

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    const { guild } = member
    const cache = {}


    let data = cache[guild.id]

    if (!data) {
      console.log('FETCHING FROM DATABASE')

      await mongo().then(async (mongoose) => {
        try {
          const result = await welcomeSchema.findOne({ _id: guild.id })

          cache[guild.id] = data = [result.channelId, result.text]
        } finally {
          mongoose.connection.close()
        }
      })
    }

    const channelId = data[0]
    const text = data[1]
    const channel = guild.channels.cache.get(channelId)
    channel.send(text.replace(/<@>/g, `<@${member.id}>`))
    

    const canvas = Canvas.createCanvas(700, 300)
    const ctx = canvas.getContext('2d')

    const background = await Canvas.loadImage(
      'https://www.fg-a.com/wallpapers/2020-black-crystalline-peaks-image.jpg')
    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)

    const pfp = await Canvas.loadImage(
      member.user.displayAvatarURL({
        format: 'png',
      })
    )
    x = canvas.width / 2 - pfp.width / 2
    y = 25
    ctx.drawImage(pfp, x, y)

    ctx.fillStyle = '#ffffff'
    ctx.font = '35px sans-serif'
    let bannertext = `Welcome ${member.user.tag}`
    x = canvas.width / 2 - ctx.measureText(bannertext).width / 2
    ctx.fillText(bannertext, x, 60 + pfp.height)

    ctx.font = '30px sans-serif'
    bannertext2 = `Member #${guild.memberCount}`
    x = canvas.width / 2 - ctx.measureText(bannertext2).width / 2
    ctx.fillText(bannertext2, x, 100 + pfp.height)

    const attachment = new MessageAttachment(canvas.toBuffer())
    
    channel.send(attachment)
  })
}
    