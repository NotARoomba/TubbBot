const Discord = require("discord.js");
let RedditAPI = require("reddit-wrapper-v2");
const { validImgurURL } = require("../../function.js")
let redditConn = new RedditAPI({
    // Options for Reddit Wrapper
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    app_id: process.env.REDDIT_ID,
    api_secret: process.env.REDDIT_SECRET,
    user_agent: "Reddit-Watcher-V2",
    retry_on_wait: true,
    retry_on_server_error: 5,
    retry_delay: 1
});
module.exports = {
    name: 'reddit',
    group: 'utility',
    usage: `reddit (subreddit) (hot/top/new)`,
    description: 'Fetches a meme from a subreddit',
    subcommands: ['hot', 'top', 'new'],
    aliases: ['meme', 'memes'],
    async execute(message, args, client) {
			try {
			let result = await client.pool.db("Tubb").collection("servers").find({id: message.guild.id}).toArray()
			prefix = result[0].prefix
        if (typeof args !== 'object') args = args.split(" ")
        let subreddits = ["memes", "dankmemes", "meme"];
        let response;
        if (args[1] == 'top') args[1] = `top/?t=all`
        let chosen = args[0].length == 0 ? subreddits[Math.floor(Math.random() * subreddits.length)] : args[0]
        response = await redditConn.api.get(`/r/${chosen}/${args[1] == undefined ? 'hot' : args[1]}`, { limit: 100 }).catch(console.error).then(async (response) =>
            response = await redditConn.api.get(`/r/${chosen}/${args[1] == undefined ? 'hot' : args[1]}`, { limit: 100 })
        )
        if (!response) return await module.exports.execute(message, args);
        if (response[1] === undefined) return await module.exports.execute(message, args);
        if (response[1].data === undefined || response[1].data.children[0] === undefined || response[1].data.children[0].data === undefined || response[1].data.children[0].data.url === undefined) return await module.exports.execute(message, args);
        let data = response[1].data.children[Math.floor(Math.random() * response[1].data.children.length)].data;
        if (!data || data.url === undefined || (!data.url.endsWith(".jpg") && !data.url.endsWith(".png") && !data.url.endsWith(".gif") && !validImgurURL(data.url))) return await module.exports.execute(message, args);
        const em = new Discord.MessageEmbed()
            .setTitle(`${data.title.substring(0, 256)}`)
            .setURL(`https://reddit.com${data.permalink}`)
            .setImage(data.url)
            .setColor('#FF5700')
            .setFooter(`${data.ups} 👍 | ${data.downs} 👎 | ${data.num_comments} 🗨`)
            .setTimestamp();
        message.channel.send(em);
			} catch {message.reply(`use "${prefix}help reddit" for usage.`)}
    }
};