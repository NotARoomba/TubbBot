const axios = require('axios')
const redditPostToEmbed = require('@util/redditPostToEmbed')

module.exports = {
    commands: 'random',
    description: 'Gets a random post from a Subreddit',
    callback: async function find(message) {
        let mes = message.content.slice(8)
        let args = mes.split(' ')
      
        try {
          if (args[0] !== undefined && args[0] > 10) {
            await message.reply(
              `I can't send you more than **10** messages :confused:`
            )
         
            return
          } else {
            let res = await axios.get(
              `https://www.reddit.com/r/random/top.json?limit=1`
            )
            const posts = res.data.data.children
            if (posts.length == 0) {
            
              return await message.reply(
                `I can't find anything new in **${args[0]}** :confused: `
              )
            }
      
            for (const post of posts) {
              if (post.data.over_18 === true && message.channel.nsfw === false) {
            
                return await message.reply(
                  `This post is NSFW! Try get it on NSFW channel! :confused:`
                )
              } else {
                const embed = redditPostToEmbed(post)
                await message.channel.send({ embed })
   
                return
              }
            }
          }
        } catch (Error) {
          console.log(Error)
          await message.reply('No subreddits named `' + mes + '` :confused:')

          return
    }
    }
}