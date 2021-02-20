const ytdl = require('ytdl-core')
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
    formatSeconds(time) {
        const formatted = new Date(time * 1000).toISOString().substr(11, 8)
        return formatted
    },
    async addYTURL(message, args, voiceChannel) {
        const video = await (await ytdl.getBasicInfo(args)).videoDetails
        song = {
            title: video.title,
            lengthFormatted: module.exports.formatSeconds(video.lengthSeconds),
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
}