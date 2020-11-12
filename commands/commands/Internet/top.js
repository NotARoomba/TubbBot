const axios = require('axios')
const redditPostToEmbed = require('@util/redditPostToEmbed')


module.exports = {
    commands: 'top',
    description: 'Gets top posts from a Subreddit',
    callback: async function find(message) {

  let mes = message.content.slice(5)
  let args = mes.split(' ')

  if (mes === '') {
    await message.reply('You need to type subreddit name here!')
    return
  } else {
    try {
      if (args[1] !== undefined && args[1] > 10) {
    
        return await message.reply(
          `I can't send you more than **10** messages :confused:`
        )
      } else {
        let res
        if (args[1] === undefined) {
          res = await axios.get(
            `https://www.reddit.com/r/${args[0]}/top.json?limit=1&sort=new`
          )
        } else {
          res = await axios.get(
            `https://www.reddit.com/r/${args[0]}/top.json?limit=${args[1]}&sort=new`
          )
        }

        const posts = res.data.data.children
        if (posts.length == 0) {

          return message.reply(
            `There are no hot posts on **${args[0]}** :confused: `
          )
        }

        for (const post of posts) {
          if (post.data.over_18 === true && message.channel.nsfw === false) {
            return message.reply(
              `This post is NSFW! Try get it on NSFW channel! :confused:`
            )
          } else {
            const embed = redditPostToEmbed(post)
            return await message.channel.send({ embed })
          }
        }
      }
    } catch (Error) {
      console.log(Error)
      return message.reply('No subreddits named `' + mes + '` :confused:')
    }
  }
}
}