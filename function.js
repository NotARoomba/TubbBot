const ytsr = require("ytsr");
const ytsr2 = require("youtube-sr").default;
const ytpl = require("ytpl");
const ytdl = require("ytdl-core");
const moment = require("moment");
require("moment-duration-format")(moment);
const fetch = require("node-fetch")
const SoundCloud = require("soundcloud-scraper");
const sc = new SoundCloud.Client(process.env.SOUNDCLOUD);
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
    validSCURL: (str) => !!str.match(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.+)?/),
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
                voiceChannel: voiceChannel,
                memberDisplayName: message.member.user.username,
                memberAvatar: message.member.user.avatarURL('webp', false, 16)
            })
        }
        return result
    },
    async addSPURL(message, query, voiceChannel) {
        const results = []
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
                var musics = await spotifyApi.getPlaylist(musicID, { limit: 50 });
                var tracks = musics.body.tracks.items;
                async function checkAll() {
                    if (musics.body.tracks.next) {
                        var offset = musics.body.tracks.offset + 50;
                        musics = await spotifyApi.getPlaylist(musicID, { limit: 50, offset: offset });
                        tracks = tracks.concat(musics.body.tracks.items);
                        return await checkAll();
                    }
                }
                await checkAll();
                for (var i = 0; i < tracks.length; i++) {
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
                    let data = await spotifyApi.getAlbumTracks(musicID, { limit: 50 });
                    tracks = data.body.items;
                    async function checkAll() {
                        if (!data.body.next) return;
                        var offset = data.body.offset + 50;
                        data = await spotifyApi.getAlbumTracks(musicID, { limit: 50, offset: offset });
                        tracks = tracks.concat(data.body.items);
                        return await checkAll();
                    }
                    await checkAll();
                } else {
                    const data = await spotifyApi.getTracks([musicID]);
                    tracks = data.body.tracks;
                }
                for (var i = 0; i < tracks.length; i++) {
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
                                voiceChannel: voiceChannel,
                                memberDisplayName: message.member.user.username,
                                memberAvatar: message.member.user.avatarURL('webp', false, 16)
                            });
                        }

                    }
                }
                break;
        }
        return results
    },
    async addSCURL(message, query, voiceChannel) {
        const results = []
        try {
            await sc.getSongInfo(query)
        } catch (err) {
            if (err) {
                const data = await sc.getPlaylist(query)
                for (const track of data.tracks) {
                    const length = Math.round(track.duration / 1000);
                    const songLength = moment.duration(length, "seconds").format();
                    results.push({
                        title: track.title,
                        url: track.url,
                        thumbnail: track.thumbnail,
                        isLive: false,
                        lengthFormatted: songLength,
                        lengthSeconds: length,
                        seek: 0,
                        type: 1,
                        voiceChannel: voiceChannel,
                        memberDisplayName: message.member.user.username,
                        memberAvatar: message.member.user.avatarURL('webp', false, 16)
                    });

                }
                return results
            } else {
                const data = await sc.getSongInfo(query)
                const length = Math.round(data.duration / 1000);
                const songLength = moment.duration(length, "seconds").format();
                results.push({
                    title: data.title,
                    url: data.url,
                    thumbnail: data.thumbnail,
                    isLive: false,
                    lengthFormatted: songLength,
                    lengthSeconds: length,
                    seek: 0,
                    type: 1,
                    voiceChannel: voiceChannel,
                    memberDisplayName: message.member.user.username,
                    memberAvatar: message.member.user.avatarURL('webp', false, 16)
                });
                return results
            }
        }
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
        if (metadata.common.picture[0] !== undefined) {
            imagedata = await imgurUploader(metadata.common.picture[0].data, { title: 'music-metadata' })
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
            thumbnail: (imagedata !== 0) ? imagedata.link : 'https://cdn3.iconfinder.com/data/icons/symbol-color-documents-1/32/file_music-link-512.png',
            isLive: false,
            lengthFormatted: songLength,
            lengthSeconds: length,
            seek: 0,
            type: 2,
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
            if (metadata.common.picture[0] !== undefined) {
                imagedata = await imgurUploader(metadata.common.picture[0].data, { title: 'music-metadata' })
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
                thumbnail: (imagedata !== 0) ? imagedata.link : "https://www.flaticon.com/svg/static/icons/svg/2305/2305904.svg",
                isLive: false,
                lengthFormatted: songLength,
                lengthSeconds: length,
                seek: 0,
                type: 2,
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
            voiceChannel: voiceChannel,
            memberDisplayName: message.member.user.username,
            memberAvatar: message.member.user.avatarURL('webp', false, 16)
        });
        return results
    },
    async search(message, query, voiceChannel) {
        const results = []
        const videos = await ytsr2.search(query, { limit: 1 }).catch(async function () {
            await message.reply('there was a problem searching the video you requested!');
            return;
        });
        if (videos.length < 1 || !videos) {
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
    defaultEmbed(message, array, name, client) {
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
    searchArray(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            try {
                if (myArray[i].name === nameKey || myArray[i].aliases[0] === nameKey || myArray[i].aliases[1] === nameKey || myArray[i].aliases[2] === nameKey || myArray[i].aliases[3] === nameKey) {
                    return myArray[i];
                }
            } catch (err) { }
        }
    },
    async updateQueue(message, client) {
        const queue = message.guild.musicData.queue
        if (!queue) return
        const [sql] = await client.pool.query(`SELECT queue FROM servers WHERE id = ${message.guild.id}`);
        if (sql[0] == undefined) {
            await client.pool.query(`INSERT INTO servers (id, queue) VALUES ('${message.guild.id}','${escape(JSON.stringify(queue))}}')`)
        } else {
            await client.pool.query(`UPDATE servers SET queue = '${escape(JSON.stringify(queue))}' WHERE id = ${message.guild.id}`);
        }
    },
    async getQueue(message, client) {
        let [queue] = await client.pool.query(`SELECT queue FROM servers WHERE id = ${message.guild.id}`)
        try {
            queue = await JSON.parse(unescape((queue[0].queue)))
            return queue
        } catch (err) {
            return 404
        }
    },
    isValidCommander(message) {
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
    }
}