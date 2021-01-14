const { validURL, validYTURL, validSPURL, validGDURL, isGoodMusicVideoContent, decodeHtmlEntity, validYTPlaylistURL, validSCURL, validMSURL, validPHURL, isEquivalent, ID, requestStream, bufferToStream, moveArray } = require("@util/function.js");
const { parseBody, getMP3 } = require("@cmds/utility/musescore.js");
const ytdl = require("ytdl-core");
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
//require('@discordjs/opus')
const WebMscore = require("webmscore").default;
const fetch = require("fetch-retry")(require("node-fetch"), { retries: 5, retryDelay: attempt => Math.pow(2, attempt) * 1000 });
const mm = require("music-metadata");
const ytsr = require("ytsr");
const ytsr2 = require("youtube-sr");
const ytpl = require("ytpl");
const moment = require("moment");
require("moment-duration-format")(moment);
const rp = require("request-promise-native");
const cheerio = require("cheerio");
var cookie = { cookie: process.env.COOKIE, id: 0 };
module.exports = class SaveToPlaylistCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'save-to-playlist',
      aliases: ['stp', 'save-song', 'add-to-playlist', 'add-song'],
      group: 'music',
      memberName: 'save-to-playlist',
      guildOnly: true,
      description: 'Save a song or a playlist to a saved playlist',
      args: [
        {
          key: 'playlist',
          prompt: 'What is the playlist you would like to save to?',
          type: 'string'
        },
        {
          key: 'query',
          prompt:
            'What url would you like to save to playlist? It can also be a playlist url',
          type: 'string',
          // default: '' // @TODO support saving currently playing song
        }
      ]
    });
  }

  async run(message, { playlist, query }) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    // check if user has playlists or user is in the db
    const dbUserFetch = db.get(message.member.id);
    if (!dbUserFetch) {
      message.reply('You have zero saved playlists!');
      return;
    }
    const savedPlaylistsClone = dbUserFetch.savedPlaylists;
    if (savedPlaylistsClone.length == 0) {
      message.reply('You have zero saved playlists!');
      return;
    }
    let found = false;
    let location;
    for (let i = 0; i < savedPlaylistsClone.length; i++) {
      if (savedPlaylistsClone[i].name == playlist) {
        found = true;
        location = i;
        break;
      }
    }
    if (found) {
      let urlsArrayClone = savedPlaylistsClone[location].urls;
      const processedURL = await SaveToPlaylistCommand.processURL(query, message);
      if (Array.isArray(processedURL)) {
        urlsArrayClone = urlsArrayClone.concat(processedURL);
        savedPlaylistsClone[location].urls = urlsArrayClone;
        message.reply('The playlist you provided was successfully saved!');
      } else {
        urlsArrayClone.push(processedURL);
        savedPlaylistsClone[location].urls = urlsArrayClone;
        message.reply(
          `I added **${savedPlaylistsClone[location].urls[
            savedPlaylistsClone[location].urls.length - 1
          ].title
          }** to **${playlist}**`
        );
      }
      db.set(message.member.id, { savedPlaylists: savedPlaylistsClone });
    } else {
      message.reply(`You have no playlist named ${playlist}`);
      return;
    }
  }

  static async processURL(query, message) {
    try {
      var result = { error: true };
      if (validYTPlaylistURL(query)) result = await SaveToPlaylistCommand.addYTPlaylist(message, query);
      else if (validYTURL(query)) result = await SaveToPlaylistCommand.addYTURL(message, query);
      else if (validSPURL(query)) result = await SaveToPlaylistCommand.addSPURL(message, query);
      else if (validSCURL(query)) result = await SaveToPlaylistCommand.addSCURL(message, query);
      else if (validGDURL(query)) result = await SaveToPlaylistCommand.addGDURL(message, query);
      else if (validMSURL(query)) result = await SaveToPlaylistCommand.addMSURL(message, query);
      else if (validURL(query)) result = await SaveToPlaylistCommand.addURL(message, query);
      else if (message.attachments.size > 0) result = await SaveToPlaylistCommand.addAttachment(message);
      //console.log(result)
      return result
    } catch (err) {
      await message.reply("there was an error trying to get the metadata!");
      console.error(err);
    }
  }
  static async addAttachment(message) {
    let urlsArr = [];
    const files = message.attachments;

    for (const file of files.values()) {
      if (file.url.endsWith("mscz") || file.url.endsWith("mscx")) {
        const buffer = await fetch(file.url).then(res => res.arrayBuffer());
        await WebMscore.ready;
        const score = await WebMscore.load(file.url.split(".").slice(-1)[0], new Uint8Array(buffer));
        const title = await score.title();
        const duration = moment.duration(Math.round((await score.metadata()).duration), "seconds").format();
        urlsArr.push({
          id: ID(),
          title: title,
          url: file.url,
          type: 7,
          time: duration,

          thumbnail: "https://pbs.twimg.com/profile_images/1155047958326517761/IUgssah__400x400.jpg",
          isLive: false,
          memberDisplayName: message.member.user.username,
          memberAvatar: message.member.user.avatarURL('webp', false, 16)
        });
        continue;
      }
      const stream = await fetch(file.url).then(res => res.body);
      try {
        var metadata = await mm.parseStream(stream, {}, { duration: true });
      } catch (err) {
        message.channel.send("The audio format is not supported!");
        return { error: true };
      }
      if (!metadata) {
        message.channel.send("An error occured while parsing the audio file into stream! Maybe it is not link to the file?");
        return { error: true };
      }
      const length = Math.round(metadata.format.duration);
      const songLength = moment.duration(length, "seconds").format();
      urlsArr.push({
        id: ID(),
        title: (file.name ? file.name.split(".").slice(0, -1).join(".") : file.url.split("/").slice(-1)[0].split(".").slice(0, -1).join(".")).replace(/_/g, " "),
        url: file.url,
        type: 2,
        time: songLength,

        thumbnail: "https://www.flaticon.com/svg/static/icons/svg/2305/2305904.svg",
        isLive: false,
        memberDisplayName: message.member.user.username,
        memberAvatar: message.member.user.avatarURL('webp', false, 16)
      });
    }
    return urlsArr;
  }
  static async addYTPlaylist(message, query) {
    let urlsArr = [];
    try {
      var playlistInfo = await ytpl(query, { limit: Infinity });
    } catch (err) {
      if (err.message === "This playlist is private.") message.channel.send("The playlist is private!");
      else {
        console.error(err);
        message.reply("there was an error trying to fetch your playlist!");
      }
      return { error: true };
    }
    const videos = playlistInfo.items;
    for (const video of videos) {
      //console.log(video)
      urlsArr.push({
        id: ID(),
        title: video.title,
        url: video.shortUrl,
        type: 0,
        time: video.duration,
        thumbnail: video.bestThumbnail.url,

        isLive: video.isLive,
        memberDisplayName: message.member.user.username,
        memberAvatar: message.member.user.avatarURL('webp', false, 16)
      });
    }
    return urlsArr;
  }
  static async addYTURL(message, query) {
    let urlsArr = [];
    try {
      var songInfo = await ytdl.getInfo(query, { requestOptions: { headers: { cookie: cookie.cookie, 'x-youtube-identity-token': process.env.YOUTUBE_API } } });
    } catch (err) {
      if (!message.dummy) message.channel.send("Failed to get video data!");
      if (err.message.toLowerCase() == "input stream: Status code: 429".toLowerCase()) {
        console.error("Received 429 error. Changing ytdl-core cookie...");
        cookie.id++;
        if (!process.env[`COOKIE${cookie.id}`]) {
          cookie.cookie = process.env.COOKIE;
          cookie.id = 0;
        }
        else cookie.cookie = process.env[`COOKIE${cookie.id}`];
      } else console.error(err);
      return { error: true };
    }
    var length = parseInt(songInfo.videoDetails.lengthSeconds);
    var songLength = length == 0 ? "∞" : moment.duration(length, "seconds").format();
    const thumbnails = songInfo.videoDetails.thumbnails;
    var thumbUrl = thumbnails[thumbnails.length - 1].url;
    var maxWidth = 0;
    for (const thumbnail of thumbnails) {
      if (thumbnail.width > maxWidth) {
        maxWidth = thumbnail.width;
        thumbUrl = thumbnail.url;
      }
    }
    //console.log(songLength)
    urlsArr.push({
      id: ID(),
      title: decodeHtmlEntity(songInfo.videoDetails.title),
      url: songInfo.videoDetails.video_url,
      type: 0,
      time: songLength,
      thumbnail: thumbUrl,

      isLive: length == 0,
      isPastLive: songInfo.videoDetails.isLiveContent,
      memberDisplayName: message.member.user.username,
      memberAvatar: message.member.user.avatarURL('webp', false, 16)
    })
    //console.log(urlsArr)
    return urlsArr;
  }
  static async addSPURL(message, query) {
    let urlsArr = [];
    const d = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(d.body.access_token);
    spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH);
    const refreshed = await spotifyApi.refreshAccessToken().catch(console.error);
    console.log("Refreshed Spotify Access Token");
    await spotifyApi.setAccessToken(refreshed.body.access_token);
    var url_array = query.replace("https://", "").split("/");
    var musicID = url_array[2].split("?")[0];
    var highlight = false;
    if (url_array[2].split("?")[1]) highlight = url_array[2].split("?")[1].split("=")[0] === "highlight";
    if (highlight) musicID = url_array[2].split("?")[1].split("=")[1].split(":")[2];
    var type = url_array[1];
    switch (type) {
      case "playlist":
        var musics = await spotifyApi.getPlaylist(musicID, { limit: 50 });
        var tracks = musics.body.tracks.items;
        //console.log(tracks)
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
          var results = [];
          try {
            const searched = await ytsr(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
            results = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
            //console.log(results)
          } catch (err) {
            console.log(err)
            try {
              const searched = await ytsr2.search(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
              results = searched.map(x => {
                return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` };
              });
              //console.log(results)
            } catch (err) {
              console.log(err)
              return { error: true };
            }
          }
          var o = 0;
          for (var s = 0; s < results.length; s++) {
            if (isGoodMusicVideoContent(results[s])) {
              o = s;
              s = results.length - 1;
            }
            if (s + 1 == results.length) {
              const songLength = !results[o].live ? results[o].duration : "∞";
              //console.log(results[o].url)
              urlsArr.push({
                id: ID(),
                title: tracks[i].track.name,
                url: results[o].url,
                type: 1,
                spot: tracks[i].track.external_urls.spotify,
                thumbnail: tracks[i].track.album.images[0].url,
                time: songLength,

                isLive: results[o].live,
                memberDisplayName: message.member.user.username,
                memberAvatar: message.member.user.avatarURL('webp', false, 16)
              });
            }
          }
        }
        //console.log(message.guild.musicData.queue)
        return urlsArr;;
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
          var results = [];
          try {
            const searched = await ytsr(`${tracks[i].artists[0].name} - ${tracks[i].name}`, { limit: 20 });
            results = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
          } catch (err) {
            console.log(err)
            try {
              const searched = await ytsr2.search(`${tracks[i].artists[0].name} - ${tracks[i].name}`, { limit: 20 });
              results = searched.map(x => {
                return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` };
              });
            } catch (err) {
              console.log(err)
              return { error: true };
            }
          }
          var o = 0;
          for (var s = 0; s < results.length; s++) {
            if (isGoodMusicVideoContent(results[s])) {
              o = s;
              s = results.length - 1;
            }
            if (s + 1 == results.length) {
              const songLength = !results[o].live ? results[o].duration : "∞";
              urlsArr.push({
                id: ID(),
                title: tracks[i].name,
                url: results[o].url,
                type: 1,
                spot: tracks[i].external_urls.spotify,
                thumbnail: highlight ? tracks[i].album.images[o].url : image,
                time: songLength,

                isLive: results[o].live,
                memberDisplayName: message.member.user.username,
                memberAvatar: message.member.user.avatarURL('webp', false, 16)
              });
            }
          }
        }
        return urlsArr;;
      case "track":
        var tracks = await (await spotifyApi.getTracks([musicID])).body.tracks;
        //console.log(tracks[0].artists[0].name)

        for (var i = 0; i < tracks.length; i++) {
          var results;
          try {
            const searched = await ytsr(`${tracks[i].artists[0].name} - ${tracks[i].name}`, { limit: 20 });
            results = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
          } catch (err) {
            console.log(err)
            try {
              const searched = await ytsr2.search(tracks[i].artists[0].name + " - " + tracks[i].name, { limit: 20 });
              results = searched.map(x => { return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` }; });
            } catch (err) {
              console.log(err)
              return { error: true };
            }
          }
          var o = 0;
          for (var s = 0; s < results.length; s++) {
            if (isGoodMusicVideoContent(results[s])) {
              o = s;
              s = results.length - 1;
            }
            if (s + 1 == results.length) {
              const songLength = !results[o].live ? results[o].duration : "∞";
              urlsArr.push({
                id: ID(),
                title: tracks[i].name,
                url: results[o].url,
                type: 1,
                spot: tracks[i].external_urls.spotify,
                thumbnail: tracks[i].album.images[o].url,
                time: songLength,

                isLive: results[o].live,
                memberDisplayName: message.member.user.username,
                memberAvatar: message.member.user.avatarURL('webp', false, 16)
              });
              return urlsArr;
            }
          }
        }
        break;
    }
  }
  static async addSCURL(message, query) {
    let urlsArr = [];
    const res = await fetch(`https://api.soundcloud.com/resolve?url=${query}&client_id=${process.env.SOUNDCLOUD_ID}`);
    if (res.status !== 200) {
      message.channel.send("A problem occured while fetching the track information! Status Code: " + res.status);
      return { error: true };
    }
    const data = await res.json();
    if (data.kind == "user") {
      message.channel.send("What do you think you can do with a user?");
      return { error: true };
    }

    if (data.kind == "playlist") {
      for (const track of data.tracks) {
        const length = Math.round(track.duration / 1000);
        const songLength = moment.duration(length, "seconds").format();
        urlsArr.push({
          id: ID(),
          title: track.title,
          type: 3,
          id: track.id,
          time: songLength,
          thumbnail: track.artwork_url,
          url: track.permalink_url,

          isLive: false,
          memberDisplayName: message.member.user.username,
          memberAvatar: message.member.user.avatarURL('webp', false, 16)
        });
      }
      return urlsArr;
    } else {
      const length = Math.round(data.duration / 1000);
      const songLength = moment.duration(length, "seconds").format();
      urlsArr.push({
        id: ID(),
        title: data.title,
        type: 3,
        id: data.id,
        time: songLength,
        thumbnail: data.artwork_url,
        url: data.permalink_url,

        isLive: false,
        memberDisplayName: message.member.user.username,
        memberAvatar: message.member.user.avatarURL('webp', false, 16)
      });
    }
    return urlsArr;
  }
  static async addGDURL(message, query) {
    let urlsArr = [];
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
        return { error: true };
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
      return { error: true };
    }
    if (!metadata) {
      message.channel.send("An error occured while parsing the audio file into stream! Maybe it is not link to the file?");
      return { error: true };
    }
    var length = Math.round(metadata.format.duration);
    var songLength = moment.duration(length, "seconds").format();
    urlsArr.push({
      id: ID(),
      title: title,
      url: link,
      type: 4,
      time: songLength,

      thumbnail: "https://drive-thirdparty.googleusercontent.com/256/type/audio/mpeg",
      isLive: false,
      memberDisplayName: message.member.user.username,
      memberAvatar: message.member.user.avatarURL('webp', false, 16)
    });
    return urlsArr;
  }
  static async addMSURL(message, query) {
    let urlsArr = [];
    try {
      var response = await rp({ uri: query, resolveWithFullResponse: true });
      if (Math.floor(response.statusCode / 100) !== 2) {
        message.channel.send(`Received HTTP status code ${response.statusCode} when fetching data.`);
        return { error: true };
      }
      var body = response.body;
    } catch (err) {
      message.reply("there was an error trying to fetch data of the score!");
      return { error: true };
    }
    var data = parseBody(body);
    var songLength = data.duration;
    urlsArr.push({
      id: ID(),
      title: data.title,
      url: query,
      type: 5,
      time: songLength,

      thumbnail: "https://pbs.twimg.com/profile_images/1155047958326517761/IUgssah__400x400.jpg",
      isLive: false,
      memberDisplayName: message.member.user.username,
      memberAvatar: message.member.user.avatarURL('webp', false, 16)
    });
    return urlsArr;
  }
  static async addURL(message, query) {
    let urlsArr = [];
    var title = query.split("/").slice(-1)[0].split(".").slice(0, -1).join(".").replace(/_/g, " ");
    try {
      var stream = await fetch(query).then(res => res.body);
      var metadata = await mm.parseStream(stream, {}, { duration: true });
      if (metadata.trackInfo && metadata.trackInfo[0] && metadata.trackInfo[0].title) title = metadata.trackInfo[0].title;
    } catch (err) {
      message.channel.send("The audio format is not supported!");
      return { error: true };
    }
    if (!metadata || !stream) {
      message.reply("there was an error while parsing the audio file into stream! Maybe it is not link to the file?");
      return { error: true };
    }
    const length = Math.round(metadata.format.duration);
    const songLength = moment.duration(length, "seconds").format();
    urlsArr.push({
      id: ID(),
      title: title,
      url: query,
      type: 2,
      time: songLength,

      thumbnail: "https://www.flaticon.com/svg/static/icons/svg/2305/2305904.svg",
      isLive: false,
      memberDisplayName: message.member.user.username,
      memberAvatar: message.member.user.avatarURL('webp', false, 16)
    });
    return urlsArr;
  }
  static constructSongObj(video, user) {
    let duration = this.formatDuration(video.duration);
    return {
      url: `https://www.youtube.com/watch?v=${video.raw.id}`,
      title: video.title,
      rawDuration: video.duration,
      duration,
      thumbnail: video.thumbnails.high.url,
      memberDisplayName: user.username,
      memberAvatar: user.avatarURL('webp', false, 16)
    };
  }
  // prettier-ignore
  static formatDuration(durationObj) {
    const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${durationObj.minutes ? durationObj.minutes : '00'
      }:${(durationObj.seconds < 10)
        ? ('0' + durationObj.seconds)
        : (durationObj.seconds
          ? durationObj.seconds
          : '00')
      }`;
    return duration;
  }
};