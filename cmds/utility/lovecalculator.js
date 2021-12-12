var axios = require("axios").default;
const Discord = require('discord.js');
module.exports = {
	name: 'lovecalculator',
	group: 'utility',
	usage: `lovecalculator (your name) (crushes' name)`,
	aliases: ['lovecalc', 'lc'],
	description: 'Calculates love between two people.',
	async execute(message, args, client) {
		args = args.split(" ")
		let prefix = process.env.PREFIX
		if (client.pool != null) {
			let result = await client.pool.db("Tubb").collection("servers").find({ id: message.guild.id }).toArray()
			prefix = result[0].prefix
		}
		if (args.length < 2) return message.reply(`usage: ${prefix}${module.exports.usage}`)
		let response = await axios.request({
			method: 'GET',
			url: 'https://love-calculator.p.rapidapi.com/getPercentage',
			params: { sname: args[1], fname: args[0] },
			headers: {
				'x-rapidapi-host': 'love-calculator.p.rapidapi.com',
				'x-rapidapi-key': process.env.RAPIDAPI
			}
		})
		data = response.data
		const embed = new Discord.MessageEmbed()
			.setTitle(`Result: ${data.result}`)
			.setAuthor(`${data.fname} x ${data.sname}`)
			.setColor(await module.exports.setColor(data.percentage))
			.setDescription(`Your chances are ${data.percentage}%`)
		message.channel.send(embed)
	},
	async setColor(p) {
		var red = p < 50 ? 255 : Math.round(256 - (p - 50) * 5.12);
		var green = p > 50 ? 255 : Math.round((p) * 5.12);
		return [red, green, 0]
	}
}