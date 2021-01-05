let RedditAPI = require("reddit-wrapper-v2");
const Discord = require("discord.js");
const { validImgurURL } = require("@util/function.js")

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

module.exports = class RedditCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            aliases: ['meme'],
            group: 'fun',
            memberName: 'reddit',
            description: 'Fetches a meme from a subreddit',
            throttling: {
                usages: 1,
                duration: 1
            },
            args: [
                {
                    key: 'arg',
                    prompt: 'What is the subreddit you wish to get a meme from?',
                    default: '',
                    type: 'string'
                },

            ]
        });
    }
    async run(message, { arg }) {
        let subreddits;
        let def = ["memes", "dankmemes", "meme"];
        let def2 = []
        def2.push(arg)
        try {
            if (arg != undefined) {
                subreddits = def2;
            }
            else {
                subreddits = def;
            }
        } catch (error) {
            console.log(error);
        }
        let chosen = subreddits[Math.floor(Math.random() * subreddits.length)];

        let response = await redditConn.api.get(`/r/${chosen}/hot`, { limit: 100 }).catch(console.error);
        if (!response) return await this.run(message, arg);
        if (response[1] === undefined) return await this.run(message, arg);
        if (response[1].data === undefined || response[1].data.children[0] === undefined || response[1].data.children[0].data === undefined || response[1].data.children[0].data.url === undefined) return await this.run(message, arg);
        let data = response[1].data.children[Math.floor(Math.random() * response[1].data.children.length)].data;
        if (!data || data.url === undefined || (!data.url.endsWith(".jpg") && !data.url.endsWith(".png") && !data.url.endsWith(".gif") && !validImgurURL(data.url))) return await this.run(message, arg);

        const em = new Discord.MessageEmbed()
            .setTitle(`${data.title.substring(0, 256)}`)
            .setURL(`https://reddit.com${data.permalink}`)
            .setImage(data.url)
            .setColor('#FF5700')
            .setFooter(
                `${data.ups} 👍 | ${data.downs} 👎 | ${data.num_comments} 🗨`
            )
            .setTimestamp();
        message.channel.send(em);
    }
};