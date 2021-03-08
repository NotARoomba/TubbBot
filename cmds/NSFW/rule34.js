const Discord = require("discord.js");
const { toTitleCase } = require("../../function.js");
const posts = require("rule34js").posts
module.exports = {
    name: 'rule34',
    group: 'NSFW',
    usage: `rule34 (query)`,
    NSFW: true,
    description: 'Searches rule34 for your query',
    aliases: ['r34'],
    async execute(message, args) {
        args = args.split(" ")
        args = args.map(x => toTitleCase(x));
        try {
            posts({ tags: args }).then(async (a) => {
                const b = a.posts
                if (b == undefined) return await message.reply(`there was an error trying to find rule34 with ${args.length > 1 ? "these tags" : "this tag"}!`);
                let post = b
                if (b.length > 1) post = b[Math.floor(Math.random() * b.length)];
                var fileUrl;
                if (post.file_url) fileUrl = post.file_url;
                else if (post.sample_url) fileUrl = post.sample_url;
                else if (post.source) fileUrl = post.source;
                else return await message.channel.send("Cannot find any image!");
                let regex = / /gi;
                const Embed = new Discord.MessageEmbed()
                    .setColor('#A55')
                    .setTitle(`Searching tags: ${args.join(", ")}`)
                    .setDescription(`Tags: \`${post.tags.slice(1, -1).replace(regex, ', ')}\``)
                    .setTimestamp()
                    .setFooter(`Powered by Rule34`, message.client.user.displayAvatarURL())
                    .setImage(fileUrl);

                await message.channel.send(Embed);
            })
        } catch (err) {
            console.log(err)
            return
        }
    }
}