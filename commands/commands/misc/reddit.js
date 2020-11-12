const { MessageEmbed } = require("discord.js");
const api = require("imageapi.js");
module.exports = {
  commands: "reddit",
  description: "Get a meme from a subreddit of your choice!",
  callback: async (message) => {
    let Subreddit = message.content.slice(8);
    let args = Subreddit.split(' ')
    if (!Subreddit)
      return message.channel.send(`You did not specify your subreddit!`);
    try {
      let img = await api(Subreddit, true);
      const Embed = new MessageEmbed()
        .setTitle(`A random image from r/${Subreddit}`)
        .setColor("RANDOM")
        .setImage(img)
        .setURL(`https://reddit.com/r/${Subreddit}`);
      message.channel.send(Embed);
    } catch (err) {
      message.channel.send(err);
    }
  },
};