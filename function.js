const ytsr = require("ytsr");
const ytsr2 = require("youtube-sr").default;
const ytpl = require("ytpl");
const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const { MongoClient } = require('mongodb');
const moment = require("moment");
require("moment-duration-format")(moment);
const fetch = require("node-fetch")
const puppeteer = require("puppeteer-core")
const { muse } = require("musescore-metadata");
const scdl = require('soundcloud-downloader').default
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
const mm = require("music-metadata");
const Pagination = require('discord-paginationembed');
const imgurUploader = require('imgur-uploader');
const rp = require("request-promise-native");
const cheerio = require("cheerio");
var ChessImageGenerator = require('chess-image-generator');
var imageGenerator = new ChessImageGenerator({
	size: 1200,
	style: 'cburnett'
});
var browser, timeout;
const sanitize = require("sanitize-filename");
const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const PNGtoPDF = (doc, url) => new Promise(async (resolve, reject) => {
	const res = await fetch(url).then(res => res.body);
	const chunks = [];
	res.on("data", chunk => chunks.push(chunk));
	res.on("end", () => {
		try {
			doc.image(Buffer.concat(chunks), 0, 0, { width: doc.page.width, height: doc.page.height });
			resolve();
		} catch (err) {
			reject(err);
		}
	});
});
module.exports = {
	list(arr, conj = 'and') {
		const len = arr.length;
		if (len === 0) return '';
		if (len === 1) return arr[0];
		return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	},
	shorten(text, maxLen = 2000) {
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	},
	formatNumber(number, minimumFractionDigits = 0) {
		return Number.parseFloat(number).toLocaleString(undefined, {
			minimumFractionDigits,
			maximumFractionDigits: 2
		});
	},
	validImgurURL: (str) => !!str.match(/^https?:\/\/(\w+\.)?imgur.com\/(\w*\w*)+(\.[a-zA-Z]{3})?$/),
	validURL: (str) => !!str.match(/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?.*)?(\#[-a-z\d_]*)?$/i),
	validYTURL: (str) => !!str.match(/^(https?:\/\/)?((w){3}.)?youtu(be|.be)?(.com)?\/.+/),
	validYTPlaylistURL: (str) => !!str.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(.com)?\/playlist\?list=\w+/),
	validSPURL: (str) => !!str.match(/open.spotify.com\/.*/),
	validGDURL: (str) => !!str.match(/^(https?)?:\/\/drive\.google\.com\/(file\/d\/(?<id>.*?)\/(?:edit|view)\?usp=sharing|open\?id=(?<id1>.*?)$)/),
	validGDFolderURL: (str) => !!str.match(/^(https?)?:\/\/drive\.google\.com\/drive\/folders\/[\w\-]+(\?usp=sharing)?$/),
	validSCURL: (str) => !!str.match(/^https?:\/\/(api\.|m\.)?(soundcloud\.com|snd\.sc)\/(.*)$/),
	validMSURL: (str) => !!str.match(/^(https?:\/\/)?musescore\.com\/(user\/\d+\/scores\/\d+|[\w-]+\/(scores\/\d+|[\w-]+))[#\?]?$/),
	async requestStream(url) {
		const fetch = require("node-fetch").default;
		return await fetch(url).then(res => res.body);
	},
	async findValueByPrefix(object, prefix) {
		for (const property in object) if (object[property] && property.toString().startsWith(prefix)) return object[property];
		return undefined;
	},
	toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	},
	async addYTURL(message, args, voiceChannel) {
		const video = await (await ytdl.getBasicInfo(args)).videoDetails
		const result = []
		result.push({
			title: video.title,
			url: video.video_url,
			thumbnail: video.thumbnails[0].url,
			isLive: video.isLiveContent && video.isLive ? true : false,
			lengthFormatted: moment.duration(video.lengthSeconds, "seconds").format(),
			lengthSeconds: video.lengthSeconds,
			type: 0,
			seek: 0,
      color: "#FF0000",
			voiceChannel: voiceChannel,
			memberDisplayName: message.member.user.username,
			memberAvatar: message.member.user.avatarURL('webp', false, 16)
		})
		return result
	},
	async addYTPlaylist(message, query, voiceChannel) {
		try {
			var playlistInfo = await ytpl(query, { limit: Infinity });
		} catch (err) {
			if (err.message === "This playlist is private.") message.channel.send("The playlist is private.");
			else {
				console.log(err);
				message.reply("there was an error trying to fetch your playlist.");
			}
			return
		}
		const result = []
		const videos = playlistInfo.items;
		for (const video of videos) {
			result.push({
				title: video.title,
				url: video.shortUrl,
				thumbnail: video.bestThumbnail.url,
				isLive: video.isLive,
				lengthFormatted: moment.duration(video.durationSec, "seconds").format(),
				lengthSeconds: video.durationSec,
				seek: 0,
				type: 0,
        color: "#FF0000",
				voiceChannel: voiceChannel,
				memberDisplayName: message.member.user.username,
				memberAvatar: message.member.user.avatarURL('webp', false, 16)
			})
		}
		return result
	},
	async addSPURL(message, query, voiceChannel) {
		const results = []
		let msg = null;
		let f;
		const d = await spotifyApi.clientCredentialsGrant();
		spotifyApi.setAccessToken(d.body.access_token);
		spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH);
		const refreshed = await spotifyApi.refreshAccessToken().catch(console.log);
		console.log("Refreshed Spotify Access Token");
		await spotifyApi.setAccessToken(refreshed.body.access_token);
		var url_array = query.replace("https://", "").split("/");
		var musicID = url_array[2].split("?")[0];
		var highlight = false;
		if (url_array[2].split("?")[1]) highlight = url_array[2].split("?")[1].split("=")[0] === "highlight";
		if (highlight) musicID = url_array[2].split("?")[1].split("=")[1].split(":")[2];
		var type = url_array[1];
		if (type === '') type = url_array[3]
		switch (type) {
			case "playlist":
				var musics = await spotifyApi.getPlaylist(musicID);
				var tracks = musics.body.tracks.items;
				f = 0;
				msg = await message.channel.send(`Adding track ${f}/${tracks.length}`)
				for (var i = 0; i < tracks.length; i++) {
					f++;
					await msg.edit(`Adding track ${f}/${tracks.length}`)
					var returned = [];
					try {
						const searched = await ytsr(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
						returned = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
					} catch (err) {
						console.log(err)
						try {
							const searched = await ytsr2.search(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
							returned = searched.map(x => {
								return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` };
							});
						} catch (err) {
							console.log(err)
							return
						}
					}
					var o = 0;
					for (var s = 0; s < returned.length; s++) {
						if (module.exports.isGoodMusicVideoContent(returned[s])) {
							o = s;
							s = returned.length - 1;
						}
						if (s + 1 == returned.length) {
							const songLength = !returned[o].live ? returned[o].duration : "∞";
							results.push({
								title: tracks[i].track.name,
								url: returned[o].url,
								thumbnail: tracks[i].track.album.images[0].url,
								isLive: returned[o].live,
								lengthFormatted: songLength,
								lengthSeconds: null,
								seek: 0,
								type: 0,
                color: "#1DB954",
								voiceChannel: voiceChannel,
								memberDisplayName: message.member.user.username,
								memberAvatar: message.member.user.avatarURL('webp', false, 16)
							});
						}
					}
				}
				break;
			case "album":
				var tracks;
				var image;
				if (!highlight) {
					const album = await spotifyApi.getAlbums([musicID]);
					image = album.body.albums[0].images[0].url;
					let data = await spotifyApi.getAlbumTracks(musicID);
					tracks = data.body.items;
				} else {
					const data = await spotifyApi.getTracks([musicID]);
					tracks = data.body.tracks;
				}
				f = 0;
				msg = await message.channel.send(`Adding track ${f}/${tracks.length}`)
				for (var i = 0; i < tracks.length; i++) {
					f++;
					await msg.edit(`Adding track ${f}/${tracks.length}`)
					var returned = [];
					try {
						const searched = await ytsr(`${tracks[i].artists[0].name} - ${tracks[i].name}`, { limit: 20 });
						returned = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
					} catch (err) {
						console.log(err)
						try {
							const searched = await ytsr2.search(`${tracks[i].artists[0].name} - ${tracks[i].name}`, { limit: 20 });
							returned = searched.map(x => {
								return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` };
							});
						} catch (err) {
							console.log(err)
							return
						}
					}
					var o = 0;
					for (var s = 0; s < returned.length; s++) {
						if (module.exports.isGoodMusicVideoContent(returned[s])) {
							o = s;
							s = returned.length - 1;
						}
						if (s + 1 == returned.length) {
							const songLength = !returned[o].live ? returned[o].duration : "∞";
							results.push({
								title: tracks[i].name,
								url: returned[o].url,
								thumbnail: highlight ? tracks[i].album.images[o].url : image,
								isLive: returned[o].live,
								lengthFormatted: songLength,
								lengthSeconds: null,
								seek: 0,
								type: 0,
                color: "#1DB954",
								voiceChannel: voiceChannel,
								memberDisplayName: message.member.user.username,
								memberAvatar: message.member.user.avatarURL('webp', false, 16)
							});
						}
					}
				}
				break;
			case "track":
				var tracks = (await spotifyApi.getTracks([musicID])).body.tracks;
				for (var i = 0; i < tracks.length; i++) {
					var returned;
					try {
						const searched = await ytsr(`${tracks[i].artists[0].name} - ${tracks[i].name}`, { limit: 20 });
						returned = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
					} catch (err) {
						console.log(err)
						try {
							const searched = await ytsr2.search(tracks[i].artists[0].name + " - " + tracks[i].name, { limit: 20 });
							returned = searched.map(x => { return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` }; });
						} catch (err) {
							console.log(err)
							return
						}
					}
					var o = 0;
					for (var s = 0; s < returned.length; s++) {
						if (module.exports.isGoodMusicVideoContent(returned[s])) {
							o = s;
							s = returned.length - 1;
						}
						if (s + 1 == returned.length) {
							const songLength = !returned[o].live ? returned[o].duration : "∞";
							results.push({
								title: tracks[i].name,
								url: returned[o].url,
								thumbnail: tracks[i].album.images[o].url,
								isLive: returned[o].live,
								lengthFormatted: songLength,
								lengthSeconds: null,
								seek: 0,
								type: 0,
                color: "#1DB954",
								voiceChannel: voiceChannel,
								memberDisplayName: message.member.user.username,
								memberAvatar: message.member.user.avatarURL('webp', false, 16)
							});
						}

					}
				}
				break;
		}
		if (msg !== null) {
			msg.delete()
		}
		return results
	},
	async addSCURL(message, query, voiceChannel) {
		const results = []
		if (scdl.isPlaylistURL(query)) {
				const data = await scdl.getSetInfo(query)
        f = 0;
        msg = await message.channel.send(`Adding track ${f}/${data.tracks.length}`)
				for (const track of data.tracks) {
          f++;
          await msg.edit(`Adding track ${f}/${data.tracks.length}`)
					const length = Math.round(track.duration / 1000);
					const songLength = moment.duration(length, "seconds").format();
					results.push({
						title: track.title,
						url: track.uri,
						thumbnail: track.artwork_url,
						isLive: false,
						lengthFormatted: songLength,
						lengthSeconds: length,
						seek: 0,
						type: 1,
            color: "#FE5000",
						voiceChannel: voiceChannel,
						memberDisplayName: message.member.user.username,
						memberAvatar: message.member.user.avatarURL('webp', false, 16)
					});
				}
			} else {
				const data = await scdl.getInfo(query)
				const length = Math.round(data.duration / 1000);
				const songLength = moment.duration(length, "seconds").format();
				results.push({
					title: data.title,
					url: data.uri,
					thumbnail: data.artwork_url,
					isLive: false,
					lengthFormatted: songLength,
					lengthSeconds: length,
					seek: 0,
					type: 1,
          color: "#FE5000",
					voiceChannel: voiceChannel,
					memberDisplayName: message.member.user.username,
					memberAvatar: message.member.user.avatarURL('webp', false, 16)
				});
		}
return results
	},
	async addURL(message, query, voiceChannel) {
		const results = []
		try {
			var stream = await fetch(query).then(res => res.body);
			var metadata = await mm.parseStream(stream, {}, { duration: true });
			if (metadata.trackInfo && metadata.trackInfo[0] && metadata.trackInfo[0].title) title = metadata.trackInfo[0].title;
		} catch (err) {
			message.channel.send("The audio format is not supported.");
			return
		}
		if (!metadata || !stream) {
			message.reply("there was an error while parsing the audio file into stream, maybe it is not link to the file?");
			return
		}
		let imagedata = 0;
		if (metadata.common.picture >= 1) {
			imagedata = new Discord.MessageAttachment(metadata.common.picture[0].data)
		}
		let title = 0
		if (metadata.common.title == undefined) {
			title = query.split("/").slice(-1)[0].split(".").slice(0, -1).join(".").replace(/_/g, " ");
		}
		const length = Math.round(metadata.format.duration);
		const songLength = moment.duration(length, "seconds").format();
		results.push({
			title: (title == 0) ? metadata.common.title : title,
			url: query,
			thumbnail: (imagedata !== 0) ? imagedata : 'https://cdn3.iconfinder.com/data/icons/symbol-color-documents-1/32/file_music-link-512.png',
			isLive: false,
			lengthFormatted: songLength,
			lengthSeconds: length,
			seek: 0,
			type: 2,
      color: "#2c2f33",
			voiceChannel: voiceChannel,
			memberDisplayName: message.member.user.username,
			memberAvatar: message.member.user.avatarURL('webp', false, 16)
		});
		return results
	},
	async addAttachment(message, voiceChannel) {
		const files = message.attachments;
		const results = []
		for (const file of files.values()) {
			const stream = await fetch(file.url).then(res => res.body);
			try {
				var metadata = await mm.parseStream(stream, {}, { duration: true });
			} catch (err) {
				message.channel.send("The audio format is not supported!");
				return
			}
			if (!metadata) {
				message.channel.send("An error occured while parsing the audio file into stream! Maybe it is not link to the file?");
				return
			}
			let imagedata = 0;
			if (metadata.common.picture >= 1) {
				imagedata = new Discord.MessageAttachment(metadata.common.picture[0].data)
			}
			let title = 0
			if (metadata.common.title == undefined) {
				title = query.split("/").slice(-1)[0].split(".").slice(0, -1).join(".").replace(/_/g, " ");
			}
			const length = Math.round(metadata.format.duration);
			const songLength = moment.duration(length, "seconds").format();
			results.push({
				title: (title == 0) ? metadata.common.title : (file.name ? file.name.split(".").slice(0, -1).join(".") : file.url.split("/").slice(-1)[0].split(".").slice(0, -1).join(".")).replace(/_/g, " "),
				url: file.url,
				thumbnail: (imagedata !== 0) ? imagedata : "https://www.flaticon.com/svg/static/icons/svg/2305/2305904.svg",
				isLive: false,
				lengthFormatted: songLength,
				lengthSeconds: length,
				seek: 0,
				type: 2,
        color: "#2c2f33",
				voiceChannel: voiceChannel,
				memberDisplayName: message.member.user.username,
				memberAvatar: message.member.user.avatarURL('webp', false, 16)
			});
		}
		return results
	},
	async addGDURL(message, query, voiceChannel) {
		const results = []
		const formats = [/https:\/\/drive\.google\.com\/file\/d\/(?<id>.*?)\/(?:edit|view)\?usp=sharing/, /https:\/\/drive\.google\.com\/open\?id=(?<id>.*?)$/];
		const alphanumeric = /^[a-zA-Z0-9\-_]+$/;
		let id;
		formats.forEach((regex) => {
			const matches = query.match(regex)
			if (matches && matches.groups && matches.groups.id) id = matches.groups.id
		});
		if (!id) {
			if (alphanumeric.test(query)) id = query;
			else {
				message.channel.send(`The link/keywords you provided is invalid! Usage: \`${message.prefix}${this.name} ${this.usage}\``);
				return
			}
		}
		var link = "https://drive.google.com/uc?export=download&id=" + id;
		var stream = await fetch(link).then(res => res.body);
		var title = "No Title";
		try {
			var metadata = await mm.parseStream(stream, {}, { duration: true });
			var html = await rp(query);
			var $ = cheerio.load(html);
			title = $("title").text().split(" - ").slice(0, -1).join(" - ").split(".").slice(0, -1).join(".");
		} catch (err) {
			message.reply("there was an error trying to parse your link!");
			return console.log(err)
		}
		if (!metadata) {
			message.channel.send("An error occured while parsing the audio file into stream! Maybe it is not link to the file?");
			return
		}
		const length = Math.round(metadata.format.duration);
		const songLength = moment.duration(length, "seconds").format();
		results.push({
			title: title,
			url: link,
			thumbnail: "https://drive-thirdparty.googleusercontent.com/256/type/audio/mpeg",
			isLive: false,
			lengthFormatted: songLength,
			lengthSeconds: length,
			seek: 0,
			type: 2,
      color: ["#1FA463", "#FFD04B", "#4688F4"][Math.floor(Math.random() * 3)],
			voiceChannel: voiceChannel,
			memberDisplayName: message.member.user.username,
			memberAvatar: message.member.user.avatarURL('webp', false, 16)
		});
		return results
	},
  async addMSURL(message, query, voiceChannel) {
    let results = []
    let length, songLength, type;
    const mp3 = await module.exports.getMP3(query);
					if (mp3.error) throw new Error(mp3.message);
					if (mp3.url.startsWith("https://www.youtube.com/embed/")) {
						const ytid = mp3.url.split("/").slice(-1)[0].split("?")[0];
						var url = `https://www.youtube.com/watch?v=${ytid}`;
            const metadata = await (await ytdl.getBasicInfo(url)).videoDetails
            length = metadata.lengthSeconds
            songLength = moment.duration(metadata.lengthSeconds, "seconds").format()
            type = 0
					} else {
            var url = mp3.url
            var stream = await fetch(url).then(res => res.body);
			      var metadata = await mm.parseStream(stream, {}, { duration: true });
           length = Math.round(metadata.format.duration);
		songLength = moment.duration(length, "seconds").format();
            type = 2
          }
    var data = await muse(query);
    results.push({
			title: data.title,
			url: url,
			thumbnail: data.thumbnail,
			isLive: false,
			lengthFormatted: songLength,
			lengthSeconds: length,
			seek: 0,
			type: type,
      color: "#1F74BD",
			voiceChannel: voiceChannel,
			memberDisplayName: message.member.user.username,
			memberAvatar: message.member.user.avatarURL('webp', false, 16)
		})
		return results
  },
	async search(message, query, voiceChannel) {
		const results = []
		const videos = await ytsr2.search(query, { limit: 1 }).catch(async function () {
			await message.reply('there was a problem searching the video you requested!');
			return;
		});
		if (videos == undefined || videos.length < 1 || !videos) {
			message.reply(`I had some trouble finding what you were looking for, please try again or be more specific.`);
			return;
		}
		const length = Math.round(videos[0].duration / 1000);
		results.push({
			title: videos[0].title,
			url: `https://www.youtube.com/watch?v=${videos[0].id}`,
			thumbnail: videos[0].thumbnail.url,
			isLive: videos[0].live,
			lengthFormatted: videos[0].durationFormatted,
			lengthSeconds: length,
			seek: 0,
			type: 0,
      color: "#FF0000",
			voiceChannel: voiceChannel,
			memberDisplayName: message.member.user.username,
			memberAvatar: message.member.user.avatarURL('webp', false, 16)
		})
		return results
	},
	isGoodMusicVideoContent(videoSearchResultItem) {
		const contains = (string, content) => !!~(string || "").indexOf(content);
		return (contains(videoSearchResultItem.author ? videoSearchResultItem.author.name : undefined, "VEVO") || contains(videoSearchResultItem.author ? videoSearchResultItem.author.name.toLowerCase() : undefined, "official") || contains(videoSearchResultItem.title.toLowerCase(), "official") || !contains(videoSearchResultItem.title.toLowerCase(), "extended"));
	},
	defaultEmbed(message, array, name, client, tosearch) {
		array = module.exports.searchForGroup(tosearch, array)
		const embed = new Pagination.FieldsEmbed()
			.setArray(array)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(10)
			.formatField('Name - Description', function (e) {
				return `**${e.name}**:  ${e.description}`;
			})
			.setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
		embed.embed.setColor('#dbc300').setTitle(`${name} Commands`).setFooter('', `${client.user.avatarURL('webp', 16)}`);;
		return embed.build();
	},
	searchForCommand(nameKey, myArray) {
		for (var i = 0; i < myArray.length; i++) {
			try {
				if (myArray[i].name === nameKey || myArray[i].aliases[0] === nameKey || myArray[i].aliases[1] === nameKey || myArray[i].aliases[2] === nameKey || myArray[i].aliases[3] === nameKey) {
					return myArray[i];
				}
			} catch (err) { }
		}
	},
	searchForGroup(nameKey, myArray) {
		const group = []
		for (var i = 0; i < myArray.length; i++) {
			try {
				if (myArray[i].group === nameKey) {
					group.push(myArray[i])
				}
			} catch (err) { }
		}
		return group;
	},
	getGroups(array) {
		const groups = []
		for (var i = 0; i < array.length; i++) {
			if (!groups.includes(array[i].group)) groups.push(array[i].group)
			if (array[i].group == undefined) console.log(array[i])
		}
		return groups
	},
	async updateQueue(message, client) {
		if (!message.guild.musicData.queue) return
    client.pool = await MongoClient.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true }).catch((err) => {
        console.log(err)
    });
		await client.pool.db("Tubb").collection("servers").updateOne({ id: message.guild.id }, { $set: { queue: escape(JSON.stringify(message.guild.musicData.queue)) } })
	},
	async getQueue(message, client) {
		let result = await client.pool.db("Tubb").collection("servers").find({ id: message.guild.id }).toArray()
		if (result[0].queue == null) {
			return 404
		} else {
			queue = await JSON.parse(unescape((result[0].queue)))
			return queue
		}
	},
	async saveQueue(message, client, name) {
		let result = await client.pool.db("Tubb").collection("users").find({ id: message.author.id }).toArray()
		queues = result[0].queues
		if (!queues) queues = []
		name = name == "" ? queues.length + 1 : name
		queues.push([[name], [escape(JSON.stringify(message.guild.musicData.queue))]])
		await client.pool.db("Tubb").collection("users").updateOne({ id: message.author.id }, { $set: { queues: queues } })
	},
	async getQueues(message, client) {
		let result = await client.pool.db("Tubb").collection("users").find({ id: message.author.id }).toArray()
		queues = result[0].queues
		if (!queues) queues = []
		for (i = 0; i < queues.length; i++) {
			queues[i][1] = await JSON.parse(unescape(queues[i][1]))
		}
		return queues
	},
	async updateQueues(message, client, queues) {
		for (i = 0; i < queues.length; i++) {
			queues[i][1] = await escape(JSON.stringify(queues[i][1]))
		}
		await client.pool.db("Tubb").collection("users").updateOne({ id: message.author.id }, { $set: { queues: queues } })
	},
	isValidCommander(message) {
		try {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				message.reply('Please join a voice channel and try again!');
				return false
			} else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
				message.reply(`You must be in the same voice channel as the bot's in order to use that!`);
				return false
			} else if (typeof message.guild.musicData.songDispatcher == 'undefined' || message.guild.musicData.songDispatcher == null) {
				message.reply('There is no song playing right now!');
				return false
			}
			return true
		} catch (err) { }
	},
	createProgressBar(message) {
		const totalTime = message.guild.musicData.nowPlaying.lengthSeconds * 1000
		const currentStreamTime = message.guild.musicData.songDispatcher.streamTime + (message.guild.musicData.nowPlaying.seek * 1000)
		const index = Math.round((currentStreamTime / totalTime) * 15)

		if ((index >= 1) && (index <= 15)) {
			const bar = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬'.split('')
			bar.splice(index, 0, '🔘')
			const currentTimecode = moment.duration(currentStreamTime / 1000, "seconds").format()
			const endTimecode = message.guild.musicData.nowPlaying.lengthFormatted
			return `${currentTimecode} ┃ ${bar.join('')} ┃ ${endTimecode}`
		} else {
			const currentTimecode = moment.duration(currentStreamTime / 1000, "seconds").format()
			const endTimecode = message.guild.musicData.nowPlaying.lengthFormatted
			return `${currentTimecode} ┃ 🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ┃ ${endTimecode}`
		}
	},
	arrayMove(arr, old_index, new_index) {
		while (old_index < 0) {
			old_index += arr.length;
		}
		while (new_index < 0) {
			new_index += arr.length;
		}
		if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr;
	},
	shuffleQueue(queue) {
		for (let i = queue.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[queue[i], queue[j]] = [queue[j], queue[i]];
		}
	},
	stringToBoolean(string) {
		switch (string.toLowerCase().trim()) {
			case "true": case "yes": case "1": return true;
			case "false": case "no": case "0": case null: return false;
			default: return Boolean(string);
		}
	},
	async leveling(message, client) {
		const a = []
		pool = client.pool
		a.push({
			author: message.author.id,
			guild: message.guild.id,
			exp: Math.round(message.content.length / 2)
		})
		setInterval(async function () {
			let xp = 0;
			let result = await pool.db("Tubb").collection("users").find({ id: message.author.id, guild: message.guild.id }).toArray()
			if (result.length == 0) await pool.db("Tubb").collection("users").insertOne({ id: message.author.id, guild: message.guild.id, xp: 0, level: 0, required: 10 })
			a.forEach(async (msg) => {
				if (msg.exp == 0 || msg.exp == undefined) return
				else {
					let usr1 = await pool.db("Tubb").collection("users").find({ id: msg.author, guild: msg.guild }).toArray()
					xp = usr1[0].xp
				}
				await pool.db("Tubb").collection("users").updateOne({ id: msg.author, guild: msg.guild }, { $set: { xp: msg.exp + xp } })
				xp = 0
				a.shift()
			});
			let usr2 = await pool.db("Tubb").collection("users").find({ id: message.author.id, guild: message.guild.id }).toArray()
			let level = usr2[0].level;
			let newxp = usr2[0].required;
			while (usr2[0].xp >= newxp) {

				newxp = newxp * 2
				level = level + 1;
			}
			if (usr2[0].level !== level) message.reply(`you leveled up to level ${level}!`)
			await pool.db("Tubb").collection("users").updateOne({ id: message.author.id, guild: message.guild.id }, { $set: { level: level, required: newxp } })
			level = 0;
			newxp = 0;
		}, 5000);
	},
	async getMP3(url) {
		const a = await module.exports.puppet(async (page) => {
			var result = { error: true };
			const start = Date.now();
			try {
				await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
				await page.setRequestInterception(true);
				page.on('request', (req) => {
					if (["image", "font", "stylesheet", "media"].includes(req.resourceType())) req.abort();
					else req.continue();
				});
				await page.goto(url, { waitUntil: "domcontentloaded" });
				await page.waitForSelector("button[title='Toggle Play']").then(el => el.click());
				const mp3 = await page.waitForRequest(req => req.url().startsWith("https://s3.ultimate-guitar.com/") || req.url().startsWith("https://www.youtube.com/embed/"));
				result.url = mp3.url();
				result.error = false;
			} catch (err) {
				result.error = true
				result.message = err.message;
			} finally {
				result.timeTaken = Date.now() - start;
				return result;
			}
		})
		return a
	},
	async getMIDI(url) {
		const a = await module.exports.puppet(async (page) => {
			var result = { error: true };
			const start = Date.now();
			try {
				await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
				await page.setRequestInterception(true);
				page.on('request', (req) => {
					if (["image", "font", "stylesheet", "media"].includes(req.resourceType())) req.abort();
					else req.continue();
				});
				await page.goto(url, { waitUntil: "domcontentloaded" });
				await page.waitForSelector("button[hasaccess]").then(el => el.click());
				const midi = await page.waitForResponse(res => {
					const url = res.url();
					return url.startsWith("https://musescore.com/api/jmuse") && url.includes("type=midi");
				});
				result.url = (await midi.json()) ?.info ?.url;
				result.error = false;
			} catch (err) {
				console.log(err)
				result.message = err.message;
			} finally {
				result.timeTaken = Date.now() - start;
				return result;
			}
		})
		return a
	},
	async getPDF(url, data) {
		if (!data) { data = await muse(url); }
		var result = { doc: null, hasPDF: false };
		var score = data.firstPage.replace(/png$/, "svg");
		var fetched = await fetch(score);
		if (!fetched.ok) {
			score = data.firstPage;
			var fetched = await fetch(score);
			if (!fetched.ok) {
				result.err = "Received Non-200 HTTP Status Code";
				return result;
			}
		}
		var pdf = [score];
		if (data.pageCount > 1) {
			const pdfapi = await module.exports.puppet(async (page) => {
				var result = { error: true };
				const start = Date.now();
				const pageCount = data.pageCount;
				try {
					const pattern = /^(https?:\/\/)?s3\.ultimate-guitar\.com\/musescore\.scoredata\/g\/\w+\/score\_\d+\.svg/;
					await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
					await page.setRequestInterception(true);
					const pages = result.pdf ? result.pdf : [];
					await page.setViewport({
						width: 1280,
						height: 720
					});
					page.on('request', (req) => {
						req.continue();
						if (req.url().match(pattern)) pages.push(req.url());
					});
					await page.goto(url, { waitUntil: "domcontentloaded" });
					const thumb = await page.waitForSelector("meta[property='og:image']");
					var png = (await (await thumb.getProperty("content")).jsonValue()).split("@")[0];
					var svg = png.split(".").slice(0, -1).join(".") + ".svg";
					var el;
					try {
						el = await page.waitForSelector(`img[src^="${svg}"]`, { timeout: 10000 });
						pages.push(svg);
					} catch (err) {
						el = await page.waitForSelector(`img[src^="${png}"]`, { timeout: 10000 });
						pages.push(png);
					}
					const height = (await el.boxModel()).height;
					await el.hover();
					var scrolled = 0;
					while (pages.length < pageCount && scrolled <= pageCount) {
						await page.mouse.wheel({ deltaY: height });
						await page.waitForRequest(req => req.url().match(pattern));
						scrolled++;
					}
					result.pdf = pages;
					result.error = false;
				} catch (err) {
					result.message = err.message;
				} finally {
					result.timeTaken = Date.now() - start;
					return result;
				}
			});
			if (pdfapi.error) return { doc: undefined, hasPDF: false };
			pdf = pdfapi.pdf;
		}
		const doc = new PDFDocument();
		var hasPDF = true;
		for (let i = 0; i < pdf.length; i++) {
			const page = pdf[i];
			try {
				const ext = page.split("?")[0].split(".").slice(-1)[0];
				if (ext === "svg") try {
					SVGtoPDF(doc, await streamToString(await requestStream(page)), 0, 0, { preserveAspectRatio: "xMinYMin meet" });
				} catch (err) {
					SVGtoPDF(doc, await fetch(page).then(res => res.text()), 0, 0, { preserveAspectRatio: "xMinYMin meet" });
				}
				else await PNGtoPDF(doc, page);
				if (i + 1 < data.pageCount) doc.addPage();
			} catch (err) {
				console.log(err)
				result.err = err.message;
				hasPDF = false;
				break;
			}
		}
		doc.end();
		return { doc: doc, hasPDF: hasPDF, pages: pdf };
	},
	async getMCSZ(data) {
		const IPNS_KEY = 'QmSdXtvzC8v8iTTZuj5cVmiugnzbR1QATYRcGix4bBsioP';
		const IPNS_RS_URL = `https://ipfs.io/api/v0/dag/resolve?arg=/ipns/${IPNS_KEY}`;
		const r = await fetch(IPNS_RS_URL);
		if (!r.ok) return { error: true, err: "Received HTTP Status Code: " + r.status };
		const json = await r.json();
		const mainCid = json.Cid['/'];
		const url = `https://ipfs.infura.io:5001/api/v0/block/stat?arg=/ipfs/${mainCid}/${data.id % 20}/${data.id}.mscz`;
		const r0 = await fetch(url);
		if (!r0.ok) return { error: true, err: "Received HTTP Status Code: " + r.status };
		const cidRes = await r0.json();
		const cid = cidRes.Key
		if (!cid) {
			const err = cidRes.Message
			if (err.includes('no link named')) return { error: true, err: "Score not in dataset" };
			else return { error: true, err: err };
		}
		const msczUrl = `https://ipfs.infura.io/ipfs/${cid}`;
		const r1 = await fetch(msczUrl);
		if (!r1.ok) return { error: true, err: "Received HTTP Status Code: " + r.status };
		return { error: false, url: msczUrl };
	},
	async getBrowser() {
		try {
			if (!browser) browser = await puppeteer.launch({
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu', "--proxy-server='direct://'", '--proxy-bypass-list=*'],
				headless: true,
				executablePath: "/usr/bin/chromium-browser"
			});
		} catch (err) {
			if (!browser) browser = await puppeteer.launch({
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu', "--proxy-server='direct://'", '--proxy-bypass-list=*'],
				headless: true,
				executablePath: "/app/.apt/usr/bin/google-chrome"
			})
		};
		return browser;
	},
	async puppet(cb) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		const b = await module.exports.getBrowser();
		const page = await b.newPage();
		const result = await cb(page);
		page.close();
		timeout = setTimeout(() => {
			browser.close();
			browser = undefined;
		}, 10000);
		return result;
	},
	async getPrefix(client, message) {
		let prefix = process.env.PREFIX
		if (client.pool != null) {
			let result = await client.pool.db("Tubb").collection("servers").find({ id: message.guild.id }).toArray()
			prefix = result[0].prefix
		}
		return prefix
	},
	async checkIfInGame(author, message, game) {
		for (i = 0; i < message.guild.games.length; i++) {
			if (message.guild.games[i].id == author && message.guild.games[i].game == game) return true
		}
		return false
	},
	async preGame(message, args, name, instructions, extra) {
		if (await module.exports.checkIfInGame(message.author.id, message, name) && args == "" || args == null) {
			message.reply(`${instructions} or type \`\`\`EXIT\`\`\` to stop playing`)
		} else if (!await module.exports.checkIfInGame(message.author.id, message, name)) {
			message.guild.games.push({
				id: message.author.id,
				game: name,
				...extra
			})
		}
		if (args == "EXIT") {
			for (i = 0; i < message.guild.games.length; i++) {
				if (message.guild.games[i].id == message.author.id) {
					message.guild.games.splice(i)
					message.reply(`Stopped playing ${name}`)
					return true
				}
			}
		}
		return false
	}
}
