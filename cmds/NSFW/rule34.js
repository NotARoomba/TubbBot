const Discord = require("discord.js");
const { toTitleCase } = require("../../function.js");
const Booru = require('booru')
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
           const a = await  Booru.search('rule34.xxx',args, { limit: 10, random:true})
                const b = a[0]
                if (b == undefined) return await message.reply(`there was an error trying to find rule34 with ${args.length > 1 ? "these tags" : "this tag"}!`);
                let post = b
                if (b.length > 1) post = b[Math.floor(Math.random() * b.length)];
                var fileUrl = post.fileUrl;
                const Embed = new Discord.MessageEmbed()
                    .setColor('#A55')
                    .setTitle(`Searching tags: ${args.join(", ")}`)
                    .setDescription(`Tags: \`${post.tags}\``)
                    .setTimestamp()
                    .setFooter(`Powered by Rule34`, message.client.user.displayAvatarURL())
                    .setImage(fileUrl);

                await message.channel.send(Embed);
        } catch (err) {
            console.log(err)
            return
        }
    }
}