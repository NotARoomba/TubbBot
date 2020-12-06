const Discord = require('discord.js');

require('dotenv');

const { guild } = member
    const cache = {}


    let data = cache[guild.id]

    if (!data) {
      console.log('FETCHING FROM DATABASE')

      
          const result = await streamSchema.findOne({ _id: guild.id })

          cache[guild.id] = data = [result.channelId, result.streamer]
      
    }
    const channelId = data[0]
    const streamer = data[1]
    const channel = guild.channels.cache.get(channelId)
const api = (`https://api.twitch.tv/helix/search/channels?query=${streamer}`,
{
    "headers": {
        "Client-ID": process.env.TWITCH_ID,
        "Authorization": "Bearer " + process.env.TWITCH
    }
}
)

  fetch.get(api).then(r => {
    if (r.body.stream === null) {
      setInterval(() => {
        fetch.get(api).then(console.log(r.body))
      }, 30000); // Set to 30 seconds, less than this causes 'node socket hang up'
    } else {
      const embed = new Discord.MessageEmbed()
        .setAuthor(
        `${r.body.stream.channel.display_name} is live on Twitch`,
        `${r.body.stream.channel.logo}`,
        `${r.body.stream.channel.url}`
      )
        .setThumbnail(`http://static-cdn.jtvnw.net/ttv-boxart/${encodeURI(r.body.stream.channel.game)}-500x500.jpg`)
        .addField('Stream Title', `${r.body.stream.channel.status}`, true)
        .addField('Playing', `${r.body.stream.channel.game}`, true)
        .addField('Followers', `${r.body.stream.channel.followers}`, true)
        .addField('Views', `${r.body.stream.channel.views}`, true)
        .setImage(r.body.stream.preview.large)

      return channel.send({ embed });
    }
  });