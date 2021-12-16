//Thanks to North-West-Wind https://github.com/North-West-Wind/NWWbot
const muse = require("musescore-metadata").default;
const Discord = require("discord.js")
const Pagination = require('discord-paginationembed');
const rp = require("request-promise-native");
const fetch = require("fetch-retry")(require("node-fetch"), { retries: 5, retryDelay: attempt => Math.pow(2, attempt) * 1000 });
const requestYTDLStream = (url, opts) => {
	const timeoutMS = opts.timeout && !isNaN(parseInt(opts.timeout)) ? parseInt(opts.timeout) : 30000;
	const timeout = new Promise((_resolve, reject) => setTimeout(() => reject(new Error(`YTDL video download timeout after ${timeoutMS}ms`)), timeoutMS));
	const getStream = new Promise((resolve, reject) => {
		const stream = ytdl(url, opts);
		stream.on("finish", () => resolve(stream)).on("error", err => reject(err));
	});
	return Promise.race([timeout, getStream]);
};
const cheerio = require("cheerio");
const sanitize = require("sanitize-filename");
const { getMP3, getPDF, getMIDI, validMSURL, requestStream, getMSCZ, findValueByPrefix } = require('../../function.js')
module.exports = {
	name: 'musescore',
	group: 'utility',
	usage: `musescore`,
	aliases: ['muse'],
	description: 'Get music from musescore!',
	async execute(message, args, client) {
		if (!validMSURL(args)) return await this.search(message, args, client);
		try {
			var data = await muse(args);
		} catch (err) {
			console.error(err);
			return message.reply("there was an error trying to fetch data of the score!");
		}
		try {
			try {
				var mesg = await message.channel.send("Generating MP3...");
				const mp3 = await getMP3(args);
				try {
					if (mp3.error) throw new Error(mp3.message);
					if (mp3.url.startsWith("https://www.youtube.com/embed/")) {
						const ytid = mp3.url.split("/").slice(-1)[0].split("?")[0];
						var res = await requestYTDLStream(`https://www.youtube.com/watch?v=${ytid}`, { highWaterMark: 1 << 25, filter: "audioonly", dlChunkSize: 0 });
					} else var res = await requestStream(mp3.url);
					const att = new Discord.MessageAttachment(res, sanitize(`${data.title}.mp3`));
					if (!res) throw new Error("Failed to get Readable Stream");
					else if (res.statusCode && res.statusCode != 200) throw new Error("Received HTTP Status Code: " + res.statusCode);
					else await message.channel.send(att);
					await mesg.delete();
				} catch (err) {
					console.log(err)
					await mesg.edit(`Failed to generate MP3! \`${err.message}\``);
				}
				mesg = await message.channel.send("Generating PDF...");
				const { doc, hasPDF, err } = await getPDF(args, data);
				try {
					if (!hasPDF) throw new Error(err ? err : "No PDF available");
					const att = new Discord.MessageAttachment(doc, sanitize(`${data.title}.pdf`));
					await message.channel.send(att);
					await mesg.delete();
				} catch (err) {
					console.log(err)
					await mesg.edit(`Failed to generate PDF! \`${err.message}\``);
				}
			} catch (err) {
				await message.reply("there was an error trying to send the files!");
			}
		} catch (err) {
			console.log(err)
			await message.channel.send("Failed to generate files!");
		}
	},
	async search(message, args, client) {
		let prefix = process.env.PREFIX
		if (client.pool != null) {
			let result = await client.pool.db("Tubb").collection("servers").find({ id: message.guild.id }).toArray()
			prefix = result[0].prefix
		}
		try {
			const response = await rp({ uri: `https://musescore.com/sheetmusic?text=${encodeURIComponent(args)}`, resolveWithFullResponse: true });
			if (Math.floor(response.statusCode / 100) !== 2) return message.channel.send(`Received HTTP status code ${response.statusCode} when fetching data.`);
			var body = response.body;
		} catch (err) {
			return message.reply("there was an error trying to search for scores!");
		}
		var $ = cheerio.load(body);
		const stores = Array.from($('div[class^="js-"]'));
		const store = findValueByPrefix(stores.find(x => x.attribs && x.attribs.class && x.attribs.class.match(/^js-\w+$/)).attribs, "data-");
		var data = JSON.parse(store);
		const embeds = [];
		var scores = data.store.page.data.scores;
		var msg = await message.channel.send("Searching for scores...")
		for (i = 0; i < 10; i++) {
			data = await muse(scores[i].share.publicUrl);
			const em = new Discord.MessageEmbed()
				.setColor('#1F74BD')
				.setTitle(data.title)
				.setURL(data.url)
				.setThumbnail(data.thumbnail)
				.setDescription(`Description: **${data.description}**\n\nTo download, please copy the URL and use \`${prefix}${this.name} <link>\``)
				.addField("ID", data.id, true)
				.addField("Author", data.user.name, true)
				.addField("Duration", data.duration, true)
				.addField("Page Count", data.pageCount, true)
				.addField("Date Created", new Date(data.created * 1000).toLocaleString(), true)
				.addField("Date Updated", new Date(data.updated * 1000).toLocaleString(), true)
				.addField(`Tags [${data.tags.length}]`, data.tags.length > 0 ? data.tags.join(", ") : "None")
				.addField(`Parts [${data.parts.length}]`, data.parts.length > 0 ? data.parts.join(", ") : "None")
				.setFooter('', `${client.user.avatarURL('webp', 16)}`)
			embeds.push(em);
		}
		const embed = new Pagination.Embeds()
			.setArray(embeds)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
		await msg.delete()
		await embed.build()
	},
}
