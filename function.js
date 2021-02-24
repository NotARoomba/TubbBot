const ytdl = require('ytdl-core')
const Pagination = require('discord-paginationembed');
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
    validSPURL: (str) => !!str.match(/^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/),
    validGDURL: (str) => !!str.match(/^(https?)?:\/\/drive\.google\.com\/(file\/d\/(?<id>.*?)\/(?:edit|view)\?usp=sharing|open\?id=(?<id1>.*?)$)/),
    validGDFolderURL: (str) => !!str.match(/^(https?)?:\/\/drive\.google\.com\/drive\/folders\/[\w\-]+(\?usp=sharing)?$/),
    validSCURL: (str) => !!str.match(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.+)?/),
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    buildTimecode(time) {
        const formatted = new Date(time * 1000).toISOString().substr(11, 8)
        return formatted
    },
    async addYTURL(message, args, voiceChannel) {
        const video = await (await ytdl.getBasicInfo(args)).videoDetails
        song = {
            title: video.title,
            lengthFormatted: module.exports.buildTimecode(video.lengthSeconds),
            lengthSeconds: video.lengthSeconds,
            author: video.author.name,
            thumbnail: video.thumbnails[0].url,
            url: video.video_url,
            type: 0,
            isLive: video.isLiveContent && video.isLive ? true : false,
            voiceChannel: voiceChannel,
            memberDisplayName: message.member.user.username,
            memberAvatar: message.member.user.avatarURL('webp', false, 16)
        }
        return song
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
    search(nameKey, myArray) {

        for (var i = 0; i < myArray.length; i++) {
            try {
                if (myArray[i].name === nameKey || myArray[i].aliases[0] === nameKey || myArray[i].aliases[1] === nameKey || myArray[i].aliases[2] === nameKey || myArray[i].aliases[3] === nameKey) {
                    return myArray[i];
                }
            } catch (err) { }
        }
    },
    async updateQueue(message, client) {
        const queue = client.player.queues.get(message.guild.id)
        if (!queue) return
        console.log(queue.tracks.player)
        const sql = await client.pool.query(`SELECT * FROM musics WHERE guild = ${message.guild.id}`);
        if (sql[0][1] === undefined) {
            await client.pool.query(`UPDATE musics SET queue = '${stringify(queue.tracks)}' WHERE guild = ${message.guild.id}`);
        } else {
            await client.pool.query(`INSERT INTO musics (guild, queue) VALUES ('${message.guild.id}','${stringify(queue.tracks)}')`)
        }
    },
    async getQueue(message, client) {
        const queue = await client.pool.query(`SELECT queue FROM musics WHERE guild = ${message.guild.id}`)
        console.log(queue[0])
        return await parse(queue[0][0].queue);
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
        const currentStreamTime = message.guild.musicData.songDispatcher.streamTime
        const index = Math.round((currentStreamTime / totalTime) * 15)

        if ((index >= 1) && (index <= 15)) {
            const bar = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬'.split('')
            bar.splice(index, 0, '🔘')
            const currentTimecode = module.exports.buildTimecode(Math.round(currentStreamTime / 1000))
            const endTimecode = message.guild.musicData.nowPlaying.lengthFormatted
            return `${currentTimecode} ┃ ${bar.join('')} ┃ ${endTimecode}`
        } else {
            const currentTimecode = module.exports.buildTimecode(Math.round(currentStreamTime / 1000))
            const endTimecode = message.guild.musicData.nowPlaying.lengthFormatted
            return `${currentTimecode} ┃ 🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ┃ ${endTimecode}`
        }
    }
}