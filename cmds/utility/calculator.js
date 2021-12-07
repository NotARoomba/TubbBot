const Discord = require('discord.js');
var math = require('mathjs')
const Pagination = require('discord-paginationembed');
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(process.env.WOLFRAM);
//https://products.wolframalpha.com/api/libraries/javascript/
module.exports = {
	name: "calculator",
	group: 'utility',
	usage: `calc (expression)`,
	aliases: ['calc'],
	description: 'Get the answer to a math problem.',
	async execute(message, args) {
		try {
			/*
			waApi.getSimple(args).then((url) => {
				const buffer = new Buffer.from(url.split(",")[1], "base64");
				const attach = new Discord.MessageAttachment(buffer, "output.png");
				message.channel.send(attach)
				const embed = new Discord.MessageEmbed()
					.setColor('#ff0000')
					.setTitle(args)
					.setAuthor('Wolfram Alpha', 'https://www.wolframalpha.com/_next/static/images/share_3G6HuGr6.png', 'https://www.wolframalpha.com/')
					.setImage(attach)
					.setTimestamp()
					.setFooter("Powered by Wolfram Alpha Api", message.client.user.displayAvatarURL());
				return message.reply(embed);
			}).catch(console.error);
			//return await math.evaluate(equation);
			*/
			const data = await waApi.getShort(args)
			message.channel.send(`\`\`\`${data}\`\`\``)
		} catch (err) {
			try {
				const embeds = [];
				await waApi.getFull(args).then((queryresult) => {
					const pods = queryresult.pods;
					const output = pods.map((pod) => {
						const subpodContent = pod.subpods.map(subpod => subpod.img.src)
						const embed = new Discord.MessageEmbed()
							.setColor('#ff0000')
							.setTitle(pod.title)
							.setAuthor('Wolfram Alpha', 'https://www.wolframalpha.com/_next/static/images/share_3G6HuGr6.png', 'https://www.wolframalpha.com/')
							.setImage(subpodContent[0])
							.setTimestamp()
							.setFooter("Powered by Wolfram Alpha Api", message.client.user.displayAvatarURL());
						embeds.push(embed)
					})
				}).catch();
				const embed = new Pagination.Embeds()
					.setArray(embeds)
					.setAuthorizedUsers([message.author.id])
					.setChannel(message.channel)
					.setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
				return await embed.build()
			} catch (err) {
				message.reply(`\`\`\`${args}\`\`\` is not a valid query.`)
			}
		}
	}
}