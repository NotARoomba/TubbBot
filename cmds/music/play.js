const { validURL, validYTURL, validSPURL, validGDURL, isGoodMusicVideoContent, decodeHtmlEntity, validYTPlaylistURL, validSCURL, validMSURL, validPHURL, isEquivalent, ID, requestStream, bufferToStream, moveArray } = require("@util/function.js");
const { parseBody, getMP3 } = require("@cmds/utility/musescore.js");
const ytdl = require("ytdl-core");
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
const WebMscore = require("webmscore").default;
const fetch = require("fetch-retry")(require("node-fetch"), { retries: 5, retryDelay: attempt => Math.pow(2, attempt) * 1000 });
const mm = require("music-metadata");
const ytsr = require("ytsr");
const ytsr2 = require("youtube-sr");
const ytpl = require("ytpl");
const moment = require("moment");
require("moment-duration-format")(moment);
const scdl = require("soundcloud-downloader").default;
const rp = require("request-promise-native");
const cheerio = require("cheerio");
const StreamConcat = require('stream-concat');
const ph = require("@justalk/pornhub-api");
//const { setQueue, updateQueue, getQueues } = require("./main.js");
var cookie = { cookie: process.env.COOKIE, id: 0 };
const youtube = new Youtube(process.env.YOUTUBE_API);
module.exports = class PlayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['p'],
      memberName: 'play',
      group: 'music',
      description: 'Play any song or playlist from youtube!',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'query',
          prompt: ':notes: What song or playlist would you like to listen to?',
          type: 'string',
          validate: function (query) {
            return query.length > 0 && query.length < 200;
          }
        }
      ]
    });
  }

  async run(message, { query }) {
    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.say(':no_entry: Please join a voice channel and try again!');
      return;
    }
    /*
     [
      { name: '1', urls: [ [Object], [Object] ] },
      { name: '2', urls: [ [Object], [Object], [Object] ] },
      { name: '3', urls: [ [Object], [Object] ] }
     ]
    */
    if (db.get(message.member.id) !== null) {
      const userPlaylists = db.get(message.member.id).savedPlaylists;
      let found = false;
      let location;
      for (let i = 0; i < userPlaylists.length; i++) {
        if (userPlaylists[i].name == query) {
          found = true;
          location = i;
          break;
        }
      }
      if (found) {
        const embed = new Discord.MessageEmbed()
          .setColor('#FFED00')
          .setTitle(':eyes: Clarification Please.')
          .setDescription(
            `You have a playlist named **${query}**, did you mean to play the playlist or search for **${query}** on YouTube?`
          )
          .addField(':arrow_forward: Playlist', '1. Play saved playlist')
          .addField(':mag: YouTube', '2. Search on YouTube')
          .addField(':x: Cancel', '3. Cancel')
          .setFooter('Choose by commenting a number between 1 and 3.');
        const clarifyEmbed = await message.say({ embed });
        message.channel
          .awaitMessages(
            function onMessage(msg) {
              return msg.content > 0 && msg.content < 4;
            },
            {
              max: 1,
              time: 30000,
              errors: ['time']
            }
          )
          .then(async function onClarifyResponse(response) {
            const msgContent = response.first().content;
            if (msgContent == 1) {
              if (clarifyEmbed) {
                clarifyEmbed.delete();
              }
              const urlsArray = userPlaylists[location].urls;
              if (urlsArray.length == 0) {
                message.reply(
                  `${query} is empty, add songs to it before attempting to play it`
                );
                return;
              }
              for (let i = 0; i < urlsArray.length; i++) {
                message.guild.musicData.queue.push(urlsArray[i]);
              }
              if (message.guild.musicData.isPlaying == true) {
                message.say(
                  `Playlist **${query} has been added to queue**`
                );
              } else if (message.guild.musicData.isPlaying == false) {
                message.guild.musicData.isPlaying = true;
                PlayCommand.playSong(message.guild.musicData.queue, message);
              }
            } else if (msgContent == 2) {
              await PlayCommand.searchYoutube(query, message, voiceChannel);
              return;
            } else if (msgContent == 3) {
              clarifyEmbed.delete();
              return;
            }
          })
          .catch(function onClarifyError() {
            if (clarifyEmbed) {
              clarifyEmbed.delete();
            }
            return;
          });
        return;
      }
    }
    try {
      var result = { error: true };
      if (validYTPlaylistURL(query)) result = await PlayCommand.addYTPlaylist(message, query);
      else if (validYTURL(query)) result = await PlayCommand.addYTURL(message, query);
      else if (validSPURL(query)) result = await PlayCommand.addSPURL(message, query);
      else if (validSCURL(query)) result = await PlayCommand.addSCURL(message, query);
      else if (validGDURL(query)) result = await PlayCommand.addGDURL(message, query);
      else if (validMSURL(query)) result = await PlayCommand.addMSURL(message, query);
      else if (validPHURL(query)) result = await PlayCommand.addPHURL(message, query);
      else if (validURL(query)) result = await PlayCommand.addURL(message, query);
      else if (message.attachments.size > 0) result = await PlayCommand.addAttachment(message);
      else result = await PlayCommand.searchYoutube(query, message, voiceChannel);
      console.log(message.guild.musicData.queue)
      message.guild.musicData.queue.push(result)
    } catch (err) {
      await message.reply("there was an error trying to connect to the voice channel!");
      if (message.guild.me.voice.channel) await message.guild.me.voice.channel.leave();
      console.error(err);
    }
  }
  static async addAttachment(message) {
    const files = message.attachments;

    for (const file of files.values()) {
      if (file.url.endsWith("mscz") || file.url.endsWith("mscx")) {
        await message.channel.send("This feature is not finished :/");
        return { error: true };
        const buffer = await fetch(file.url).then(res => res.arrayBuffer());
        await WebMscore.ready;
        const score = await WebMscore.load(file.url.split(".").slice(-1)[0], new Uint8Array(buffer));
        const title = await score.title();
        const duration = moment.duration(Math.round((await score.metadata()).duration), "seconds").format();
        message.guild.musicData.queue.push({
          id: ID(),
          title: title,
          url: file.url,
          type: 7,
          time: duration,

          thumbnail: "https://pbs.twimg.com/profile_images/1155047958326517761/IUgssah__400x400.jpg",
          isLive: false
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
      message.guild.musicData.queue.push({
        id: ID(),
        title: (file.name ? file.name.split(".").slice(0, -1).join(".") : file.url.split("/").slice(-1)[0].split(".").slice(0, -1).join(".")).replace(/_/g, " "),
        url: file.url,
        type: 2,
        time: songLength,

        thumbnail: "https://www.flaticon.com/svg/static/icons/svg/2305/2305904.svg",
        isLive: false
      });
    }
    return { error: false, songs };
  }
  static async addYTPlaylist(message, query) {
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

    for (const video of videos) message.guild.musicData.queue.push({
      id: ID(),
      title: video.title,
      url: video.shortUrl,
      type: 0,
      time: video.duration,
      thumbnail: video.thumbnail,

      isLive: video.isLive
    });
    message.say(`Track processing completed`).then(msg => msg.delete({ timeout: 10000 }).catch(() => { })).catch(() => { });
    PlayCommand.playSong(message.guild.musicData.queue, message)
    return
  }
  static async addYTURL(message, query, type = 0) {
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
    message.guild.musicData.queue.push({

      id: ID(),
      title: decodeHtmlEntity(songInfo.videoDetails.title),
      url: songInfo.videoDetails.video_url,
      type: type,
      time: songLength,
      thumbnail: thumbUrl,

      isLive: length == 0,
      isPastLive: songInfo.videoDetails.isLiveContent
    })
    return PlayCommand.playSong(message.guild.musicData.queue, message)
  }
  static async addSPURL(message, query) {
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
    var songs = [];
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
        var mesg = await message.channel.send(`Processing track: **0/${tracks.length}**`);
        for (var i = 0; i < tracks.length; i++) {
          await mesg.edit(`Processing track: **${i + 1}/${tracks.length}**`).catch(() => { });
          var results = [];
          try {
            const searched = await ytsr(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
            results = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
          } catch (err) {
            try {
              const searched = await ytsr2.search(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
              results = searched.map(x => {
                return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` };
              });
            } catch (err) {
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
              message.guild.musicData.queue.push({
                id: ID(),
                title: tracks[i].track.name,
                url: results[o].link,
                type: 1,
                spot: tracks[i].track.external_urls.spotify,
                thumbnail: tracks[i].track.album.images[0].url,
                time: songLength,

                isLive: results[o].live
              });
            }
          }
        }
        mesg.edit("Process completed").then(msg => msg.delete({ timeout: 10000 }).catch(() => { })).catch(() => { });
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
        var mesg = await message.channel.send(`Processing track: **0/${tracks.length}**`);
        for (var i = 0; i < tracks.length; i++) {
          await mesg.edit(`Processing track: **${i + 1}/${tracks.length}**`).catch(() => { });
          var results = [];
          try {
            const searched = await ytsr(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
            results = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
          } catch (err) {
            try {
              const searched = await ytsr2.search(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
              results = searched.map(x => {
                return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` };
              });
            } catch (err) {
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
              message.guild.musicData.queue.push({
                id: ID(),
                title: tracks[i].name,
                url: results[o].link,
                type: 1,
                spot: tracks[i].external_urls.spotify,
                thumbnail: highlight ? tracks[i].album.images[o].url : image,
                time: songLength,

                isLive: results[o].live
              });
            }
          }
        }
        mesg.edit("Track processing completed").then(msg => msg.delete({ timeout: 10000 })).catch(() => { });
        break;
      case "track":
        var tracks = await spotifyApi.getTracks([musicID]).body.tracks;
        for (var i = 0; i < tracks.length; i++) {
          var results;
          try {
            const searched = await ytsr(`${tracks[i].track.artists[0].name} - ${tracks[i].track.name}`, { limit: 20 });
            results = searched.items.filter(x => x.type === "video" && x.duration.split(":").length < 3);
          } catch (err) {
            try {
              const searched = await ytsr2.search(tracks[i].track.artists[0].name + " - " + tracks[i].track.name, { limit: 20 });
              results = searched.map(x => { return { live: false, duration: x.durationFormatted, link: `https://www.youtube.com/watch?v=${x.id}` }; });
            } catch (err) {
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
              message.guild.musicData.queue.push({
                id: ID(),
                title: tracks[i].name,
                url: results[o].link,
                type: 1,
                spot: tracks[i].external_urls.spotify,
                thumbnail: tracks[i].album.images[o].url,
                time: songLength,

                isLive: results[o].live
              });
            }
          }
        }
        break;
    }
    return
  }
  static async addSCURL(message, query) {
    const res = await fetch(`https://api.soundcloud.com/resolve?url=${query}&client_id=${process.env.SCID}`);
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
        message.guild.musicData.queue.push({
          id: ID(),
          title: track.title,
          type: 3,
          id: track.id,
          time: songLength,
          thumbnail: track.artwork_url,
          url: track.permalink_url,

          isLive: false
        });
      }
    } else {
      const length = Math.round(data.duration / 1000);
      const songLength = moment.duration(length, "seconds").format();
      message.guild.musicData.queue.push({
        id: ID(),
        title: data.title,
        type: 3,
        id: data.id,
        time: songLength,
        thumbnail: data.artwork_url,
        url: data.permalink_url,

        isLive: false
      });
    }
    return
  }
  static async addGDURL(message, query) {
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
    var song = {
      id: ID(),
      title: title,
      url: link,
      type: 4,
      time: songLength,

      thumbnail: "https://drive-thirdparty.googleusercontent.com/256/type/audio/mpeg",
      isLive: false
    };
    var songs = [song];
    return
  }
  static async addMSURL(message, query) {
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
    var song = {
      id: ID(),
      title: data.title,
      url: query,
      type: 5,
      time: songLength,

      thumbnail: "https://pbs.twimg.com/profile_images/1155047958326517761/IUgssah__400x400.jpg",
      isLive: false
    };
    var songs = [song];
    return
  }
  static async addPHURL(message, query) {
    try {
      const video = await ph.page(query, ["title", "duration", "download_urls"]);
      if (video.error) throw new Error(video.error);
      var download = "-1";
      for (const property in video.download_urls) if (parseInt(property) < parseInt(download) || parseInt(download) < 0) download = property;
      if (parseInt(download) < 1) throw "Cannot get any video quality";
      var songLength = moment.duration(video.duration, "seconds").format();
      var song = {
        id: ID(),
        title: video.title,
        url: query,
        type: 6,
        time: songLength,

        thumbnail: "https://plasticmick.com/wp-content/uploads/2019/07/pornhub-logo.jpg",
        isLive: false,
        download: video.download_urls[download]
      };
      return { error: false, songs: [song] };
    } catch (err) {
      if (!message.dummy) message.reply("there was an error processing the link!");
      return { error: true };
    }
  }
  static async addURL(message, query) {
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
    const song = {
      id: ID(),
      title: title,
      url: query,
      type: 2,
      time: songLength,

      thumbnail: "https://www.flaticon.com/svg/static/icons/svg/2305/2305904.svg",
      isLive: false
    };
    const songs = [song];
    return
  }
  static async search(message, query) {
    const allEmbeds = [];
    const Embed = new Discord.MessageEmbed()
      .setTitle(`Search result of ${query} on YouTube`)
      .setColor(console.color())
      .setTimestamp()
      .setFooter("Please do so within 60 seconds.", message.client.user.displayAvatarURL());
    const results = [];
    try {
      const searched = await ytsr(query, { limit: 20 });
      var video = searched.items.filter(x => x.type === "video");
    } catch (err) {
      try {
        const searched = await ytsr2.search(query, { limit: 20 });
        var video = searched.map(x => {
          return {
            live: false,
            duration: x.durationFormatted,
            link: `https://www.youtube.com/watch?v=${x.id}`,
            title: x.title,
            thumbnail: x.thumbnail.url
          }
        });
      } catch (err) {
        console.error(err);
        message.reply("there was an error trying to search the videos!");
        return { error: true };
      }
    }
    const ytResults = video.map(x => ({
      id: ID(),
      title: decodeHtmlEntity(x.title),
      url: x.link,
      type: 0,
      time: !x.live ? x.duration : "∞",
      thumbnail: x.thumbnail,

      isLive: x.live
    })).filter(x => !!x.url);
    var num = 0;
    if (ytResults.length > 0) {
      results.push(ytResults);
      Embed.setDescription("Type **soundcloud** / **sc** to show the search results from SoundCloud.\nType the index of the soundtrack to select, or type anything else to cancel.\n\n" + video.map(x => `${++num} - **[${decodeHtmlEntity(x.title)}](${x.link})** : **${x.duration}**`).slice(0, 10).join("\n"));
      allEmbeds.push(Embed);
    }
    const scEm = new Discord.MessageEmbed()
      .setTitle(`Search result of ${query} on SoundCloud`)
      .setColor(console.color())
      .setTimestamp()
      .setFooter("Please do so within 60 seconds.", message.client.user.displayAvatarURL());
    try {
      var scSearched = await scdl.search("tracks", query);
      num = 0;
    } catch (err) {
      console.error(err);
      message.reply("there was an error trying to search the videos!");
      return { error: true };
    }
    const scResults = scSearched.collection.map(x => ({
      id: ID(),
      title: x.title,
      url: x.permalink_url,
      type: 3,
      time: moment.duration(Math.floor(x.duration / 1000), "seconds").format(),
      thumbnail: x.artwork_url,

      isLive: false
    })).filter(x => !!x.url);
    if (scResults.length > 0) {
      results.push(scResults);
      scEm.setDescription("Type **youtube** / **yt** to show the search results from Youtube.\nType the index of the soundtrack to select, or type anything else to cancel.\n\n" + scResults.map(x => `${++num} - **[${x.title}](${x.permalink_url})** : **${moment.duration(Math.floor(x.duration / 1000), "seconds").format()}**`).slice(0, 10).join("\n"));
      allEmbeds.push(scEm);
    }
    if (allEmbeds.length < 1) {
      message.channel.send("Cannot find any result with the given string.");
      return { error: true };
    }
    var val = { error: true };
    var s = 0;
    var msg = await message.channel.send(allEmbeds[0]);
    const filter = x => x.author.id === message.author.id;
    const collector = await msg.channel.createMessageCollector(filter, { idle: 60000 });
    collector.on("collect", async collected => {
      collected.delete().catch(() => { });
      if (isNaN(parseInt(collected.content))) {
        switch (collected.content) {
          case "youtube":
          case "yt":
            s = 0;
            await msg.edit(allEmbeds[s]);
            break;
          case "soundcloud":
          case "sc":
            s = 1;
            await msg.edit(allEmbeds[s]);
            break;
          default:
            collector.emit("end");
        }
      } else {
        const o = parseInt(collected.content) - 1;
        if (o < 0 || o > results[s].length - 1) return collector.emit("end");
        const chosenEmbed = new Discord.MessageEmbed()
          .setColor(console.color())
          .setTitle("Music chosen:")
          .setThumbnail(results[s][o].thumbnail)
          .setDescription(`**[${decodeHtmlEntity(results[s][o].title)}](${results[s][o].url})** : **${results[s][o].time}**`)
          .setTimestamp()
          .setFooter("Have a nice day :)", message.client.user.displayAvatarURL());
        await msg.edit(chosenEmbed).catch(() => { });
        val = { error: false, songs: [results[s][o]], msg, embed: Embed };
        collector.emit("end");
      }
    });
    return new Promise(resolve => {
      collector.on("end", async () => {
        if (val.error) {
          const cancelled = new Discord.MessageEmbed()
            .setColor(console.color())
            .setTitle("Action cancelled.")
            .setTimestamp()
            .setFooter("Have a nice day! :)", message.client.user.displayAvatarURL());
          await msg.edit(cancelled).then(msg => setTimeout(() => msg.edit({ content: "**[Added Track: No track added]**", embed: null }), 30000));
        }
        resolve(val);
      });
    });
  }
  static createEmbed() { createEmbed }

  // if (
  //   // Handles PlayList Links
  //   query.match(
  //     /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
  //   )
  // ) {
  //   const playlist = await youtube.getPlaylist(query).catch(function () {
  //     message.say(':x: Playlist is either private or it does not exist!');
  //     return;
  //   });
  //   // add 10 as an argument in getVideos() if you choose to limit the queue
  //   const videosArr = await playlist.getVideos().catch(function () {
  //     message.say(
  //       ':x: There was a problem getting one of the videos in the playlist!'
  //     );
  //     return;
  //   });

  //   // Uncommented if you want to shuffle the playlist

  //   /*for (let i = videosArr.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [videosArr[i], videosArr[j]] = [videosArr[j], videosArr[i]];
  //   }
  //   */

  //   for (let i = 0; i < videosArr.length; i++) {
  //     if (videosArr[i].raw.status.privacyStatus == 'private') {
  //       continue;
  //     } else {
  //       try {
  //         const video = await videosArr[i].fetch();
  //         // this can be uncommented if you choose to limit the queue
  //         // if (message.guild.musicData.queue.length < 10) {
  //         //
  //         message.guild.musicData.queue.push(
  //           PlayCommand.constructSongObj(
  //             video,
  //             voiceChannel,
  //             message.member.user
  //           )
  //         );
  //         // } else {
  //         //   return message.say(
  //         //     `I can't play the full playlist because there will be more than 10 songs in queue`
  //         //   );
  //         // }
  //       } catch (err) {
  //         return console.error(err);
  //       }
  //     }
  //   }
  //   if (message.guild.musicData.isPlaying == false) {
  //     message.guild.musicData.isPlaying = true;
  //     return PlayCommand.playSong(message.guild.musicData.queue, message);
  //   } else if (message.guild.musicData.isPlaying == true) {
  //     const PlayListEmbed = new Discord.MessageEmbed()
  //       .setColor('#FFED00')
  //       .setTitle(`:musical_note: ${playlist.title}`)
  //       .addField(
  //         `Playlist has added ${message.guild.musicData.queue.length} songs to queue!`,
  //         playlist.url
  //       )
  //       .setThumbnail(playlist.thumbnails.high.url)
  //       .setURL(playlist.url);
  //     message.say(PlayListEmbed);
  //     // @TODO add the the position number of queue of the when a playlist is added
  //     return;
  //   }
  // }

  // // This if statement checks if the user entered a youtube url, it can be any kind of youtube url
  // if (
  //   query.match(/^(http(s)?:\/\/)?(m.)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)
  // ) {
  //   query = query
  //     .replace(/(>|<)/gi, '')
  //     .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  //   const id = query[2].split(/[^0-9a-z_\-]/i)[0];
  //   const video = await youtube.getVideoByID(id).catch(function () {
  //     message.say(':x: There was a problem getting the video you provided!');
  //     return;
  //   });

  //   // // can be uncommented if you don't want the bot to play live streams
  //   // if (video.raw.snippet.liveBroadcastContent === 'live') {
  //   //   return message.say("I don't support live streams!");
  //   // }
  //   // // can be uncommented if you don't want the bot to play videos longer than 1 hour
  //   // if (video.duration.hours !== 0) {
  //   //   return message.say('I cannot play videos longer than 1 hour');
  //   // }
  //   // // can be uncommented if you want to limit the queue
  //   // if (message.guild.musicData.queue.length > 10) {
  //   //   return message.say(
  //   //     'There are too many songs in the queue already, skip or wait a bit'
  //   //   );
  //   // }
  //   message.guild.musicData.queue.push(
  //     PlayCommand.constructSongObj(video, voiceChannel, message.member.user)
  //   );
  //   if (
  //     message.guild.musicData.isPlaying == false ||
  //     typeof message.guild.musicData.isPlaying == 'undefined'
  //   ) {
  //     message.guild.musicData.isPlaying = true;
  //     return PlayCommand.playSong(message.guild.musicData.queue, message);
  //   } else if (message.guild.musicData.isPlaying == true) {
  //     const addedEmbed = new Discord.MessageEmbed()
  //       .setColor('#FFED00')
  //       .setTitle(`:musical_note: ${video.title}`)
  //       .addField(
  //         `Has been added to queue. `,
  //         `This song is #${message.guild.musicData.queue.length} in queue`
  //       )
  //       .setThumbnail(video.thumbnails.high.url)
  //       .setURL(video.url);
  //     message.say(addedEmbed);
  //     return;
  //   }
  // }
  // //Google Drive Links
  // if (
  //   query.match('drive\.google\.com')
  // ) {
  //   let id = PlayCommand.getIdFromUrl(query)
  //   id = id[0]
  //   console.log(id)
  //   var link = `https://drive.google.com/uc?export=download&id=${id}`;
  //   var stream = await fetch(link).then(res => res.body);
  //   var title = "No Title";
  //   try {
  //     var metadata = await mm.parseStream(stream, {}, { duration: true });
  //     var html = await rp(query);
  //     var $ = cheerio.load(html);
  //     title = $("title").text().split(" - ").slice(0, -1).join(" - ").split(".").slice(0, -1).join(".");
  //   } catch (err) {
  //     message.reply("there was an error trying to parse your link!");
  //     return { error: true };
  //   }
  //   if (!metadata) {
  //     message.say("An error occured while parsing the audio file into stream! Maybe it is not link to the file?");
  //     return { error: true };
  //   }
  //   var songLength = Math.round(metadata.format.duration);
  //   var video = {
  //     title: title,
  //     url: link,
  //     duration: songLength,
  //     thumbnail: "https://drive-thirdparty.googleusercontent.com/256/type/audio/mpeg",
  //   };
  //   message.guild.musicData.queue.push(
  //     PlayCommand.constructSongObj(video, voiceChannel, message.member.user)
  //   );
  //   if (
  //     message.guild.musicData.isPlaying == false ||
  //     typeof message.guild.musicData.isPlaying == 'undefined'
  //   ) {
  //     message.guild.musicData.isPlaying = true;
  //     return PlayCommand.playSong(message.guild.musicData.queue, message);
  //   } else if (message.guild.musicData.isPlaying == true) {
  //     const addedEmbed = new Discord.MessageEmbed()
  //       .setColor('#FFED00')
  //       .setTitle(`:musical_note: ${video.title}`)
  //       .addField(
  //         `Has been added to queue. `,
  //         `This song is #${message.guild.musicData.queue.length} in queue`
  //       )
  //       .setThumbnail(video.thumbnail)
  //       .setURL(video.url);
  //     message.say(addedEmbed);
  //     return;
  //   }
  //   return
  //   // return message.say(`Google Drive not supported yet...`)
  // }
  // //Soundcloud Links
  // if (
  //   query.match('soundcloud\.com')
  // ) {
  //   //   const trackInfo = await scdl.getInfo(query, SOUNDCLOUD_CLIENT_ID);
  //   //   song = {
  //   //     title: trackInfo.title,
  //   //     url: url,
  //   //   };
  //   //   message.guild.musicData.queue.push(
  //   //     PlayCommand.constructSongObj(video, voiceChannel, message.member.user)
  //   //   );
  //   return message.say(`Soundcloud not supported yet...`)
  // }
  // //Spotify links
  // if (
  //   query.includes('open.spotify\.com')
  // ) {
  //   var spotifyApi = new SpotifyWebApi()
  //   spotifyApi.setCredentials({
  //     clientId: process.env.SPOTIFY_CLIENT_ID,
  //     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  //   })
  //   // Retrieve an access token.

  //   const d = await spotifyApi.clientCredentialsGrant();
  //   spotifyApi.setAccessToken(d.body.access_token);
  //   spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH);
  //   const refreshed = await spotifyApi.refreshAccessToken().catch(console.error);
  //   console.log("Refreshed Spotify Access Token");
  //   await spotifyApi.setAccessToken(refreshed.body.access_token);
  //   let songData;
  //   let songInfo;
  //   const spotifyTracks = [];
  //   try {
  //     songData = spotifyUri.parse(query);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   message.reply(`Fetching songs...`)
  //   if (songData.type === "track") {
  //     spotifyApi.getTrack(songData.id)
  //       .then(async (data) => {
  //         const track = data.body;
  //         const results = await youtube.searchVideos(
  //           `${track.name} ${track.artists[0].name}`
  //         );
  //         songInfo = await ytdl.getInfo(results[0].url);

  //         await spotifyTracks.push({
  //           url: songInfo.videoDetails.video_url,
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   } else if (songData.type === "album") {
  //     spotifyApi.getAlbum(songData.id).then((data) => {
  //       const album = data.body;
  //       const tracks = album.tracks.items;

  //       tracks.forEach(async (track) => {
  //         const results = await youtube.searchVideos(
  //           `${track.name} ${track.artists[0].name}`
  //         );
  //         songInfo = await ytdl.getInfo(results[0].url);

  //         await spotifyTracks.push({
  //           url: songInfo.videoDetails.video_url,
  //         });
  //       });
  //     });
  //   } else if (songData.type === "playlist") {
  //     spotifyApi.getPlaylistTracks(songData.id).then((data) => {
  //       const playlist = data.body;

  //       playlist.items.forEach(async (item) => {
  //         const results = await youtube.searchVideos(
  //           `${item.track.name} ${item.track.artists[0].name}`
  //         );
  //         songInfo = await ytdl.getInfo(results[0].url);

  //         await spotifyTracks.push({
  //           url: songInfo.videoDetails.video_url,
  //         });
  //       });
  //     })
  //   }
  //   setTimeout(async () => {
  //     spotifyTracks.forEach(async (track) => {
  //       const id = PlayCommand.matchYoutubeUrl(track.url)
  //       const video = await youtube.getVideoByID(id).catch(function () {
  //         message.say(':x: There was a problem getting the video you provided!');
  //         return;
  //       });
  //       message.guild.musicData.queue.push(
  //         PlayCommand.constructSongObj(video, voiceChannel, message.member.user)
  //       );
  //       if (
  //         message.guild.musicData.isPlaying == false ||
  //         typeof message.guild.musicData.isPlaying == 'undefined'
  //       ) {
  //         message.guild.musicData.isPlaying = true;
  //         return PlayCommand.playSong(message.guild.musicData.queue, message);
  //       } else if (message.guild.musicData.isPlaying == true) {
  //         const addedEmbed = new Discord.MessageEmbed()
  //           .setColor('#FFED00')
  //           .setTitle(`:musical_note: ${video.title}`)
  //           .addField(
  //             `Has been added to queue. `,
  //             `This song is #${message.guild.musicData.queue.length} in queue`
  //           )
  //           .setThumbnail(video.thumbnails.high.url)
  //           .setURL(video.url);
  //         message.say(addedEmbed);
  //         return;
  //       }
  //     });
  //   }, 6000);
  //   return
  // }

  // if user provided a song/video name

  static getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }
  static matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
  }
  static async playSong(queue, message) {
    const classThis = this; // use classThis instead of 'this' because of lexical scope below
    if (queue[0].voiceChannel == undefined) {
      // happens when loading a saved playlist
      queue[0].voiceChannel = message.member.voice.channel;
    }
    if (message.guild.me.voice.channel !== null) {
      if (message.guild.me.voice.channel.id !== queue[0].voiceChannel.id) {
        queue[0].voiceChannel = message.guild.me.voice.channel;
      }
    }
    try {
      //const dispatcher = queue[0].voicechannel.join()
      console.log(dispatcher)
      const silence = await requestStream("https://raw.githubusercontent.com/anars/blank-audio/master/1-second-of-silence.mp3");
      switch (queue[0].type) {
        case 0:
          if (queue[0].isLive) {
            const k = await module.exports.addYTURL(message, query, queue[0].type);
            if (k.error) throw "Failed to find video";
            if (!isEquivalent(k.songs[0], queue[0])) {
              queue[0] = k.songs[0];
              queue.songs[queue.songs.indexOf(queue[0])] = queue[0];
            }
          }
          queue[0].voicechannel.join()
          if (!queue[0].isLive && !queue[0].isPastLive) dispatcher = connection.play(ytdl(queue[0].url, { filter: "audioonly", dlChunkSize: 0, highWaterMark: 1 << 25, requestOptions: { headers: { cookie: cookie.cookie, 'x-youtube-identity-token': process.env.YOUTUBE_API } } }), { seek: seek });
          else if (queue[0].isPastLive) dispatcher = connection.play(ytdl(queue[0].url, { highWaterMark: 1 << 25, requestOptions: { headers: { cookie: cookie.cookie, 'x-youtube-identity-token': process.env.YOUTUBE_API } } }), { seek: seek });
          else dispatcher = connection.play(ytdl(queue[0].url, { highWaterMark: 1 << 25, requestOptions: { headers: { cookie: cookie.cookie, 'x-youtube-identity-token': process.env.YOUTUBE_API } } }));
          break;
        case 2:
        case 4:
          const a = await requestStream(queue[0].url);
          dispatcher.play(new StreamConcat([a, silence], { highWaterMark: 1 << 25 }), { seek: seek });
          break;
        case 3:
          dispatcher.play(await scdl.download(queue[0].url));
          break;
        case 5:
          const c = await getMP3(queue.pool, queue[0].url);
          if (c.error) throw new Error(c.message);
          if (c.url.startsWith("https://www.youtube.com/embed/")) var d = ytdl(c.url);
          else var d = await requestStream(c.url);
          dispatcher.play(new StreamConcat([d, silence], { highWaterMark: 1 << 25 }), { seek: seek });
          break;
        case 6:
          var f = await requestStream(queue[0].download);
          if (f.statusCode != 200) {
            const g = await module.exports.addPHURL(message, query);
            if (g.error) throw "Failed to find video";
            queue[0] = g;
            queue.songs[queue.songs.indexOf(queue[0])] = queue[0];
            updateQueue(message, queue, queue.pool);
            f = await requestStream(queue[0].download);
            if (f.statusCode != 200) throw new Error("Received HTTP Status Code: " + f.statusCode);
          }
          dispatcher.play(new StreamConcat([f, silence], { highWaterMark: 1 << 25 }), { seek: seek });
          break;
        case 7:
          const h = await fetch(queue[0].url);
          if (!h.ok) throw new Error("Received HTTP Status Code: " + h.status);
          await WebMscore.ready;
          const i = await WebMscore.load(queue[0].url.split(".").slice(-1)[0], new Uint8Array(await h.arrayBuffer()));
          const sf3 = await fetch("https://drive.google.com/uc?export=download&id=1IifZ2trH4gAlbzNWUylCCEvbN3trOYep").then(res => res.arrayBuffer());
          await i.setSoundFont(new Uint8Array(sf3));
          const j = bufferToStream(Buffer.from((await i.saveAudio("wav")).buffer));
          dispatcher.play(new StreamConcat([j, silence], { highWaterMark: 1 << 25 }), { seek: seek });
          break;
      } 
      
    } catch (err) {
      console.error(err);
      return;
    }
    const a = await requestStream(queue[0].url);
    queue[0].voiceChannel
      .join()
      .then(function (connection) {
        const dispatcher = connection
          .play(
            ytdl(queue[0].url, {
              filter: 'audio',
              quality: 'highestaudio',
              highWaterMark: 1 << 25
            })
            || new StreamConcat(a, { highWaterMark: 1 << 25 }), { seek: seek })
          .on('start', function () {
            message.guild.musicData.songDispatcher = dispatcher;
            if (!db.get(`${message.guild.id}.serverSettings.volume`))
              dispatcher.setVolume(message.guild.musicData.volume);
            else
              dispatcher.setVolume(
                db.get(`${message.guild.id}.serverSettings.volume`)
              );

            const videoEmbed = new Discord.MessageEmbed()
              .setThumbnail(queue[0].thumbnail)
              .setColor('#FFED00')
              .addField(':notes: Now Playing:', queue[0].title)
              .addField(':stopwatch: Duration:', queue[0].duration)
              .setURL(queue[0].url)
              .setFooter(
                `Requested by ${queue[0].memberDisplayName}!`,
                queue[0].memberAvatar
              );

            if (queue[1] && !message.guild.musicData.loopSong)
              videoEmbed.addField(':track_next: Next Song:', queue[1].title);
            message.say(videoEmbed);
            message.guild.musicData.nowPlaying = queue[0];
            queue.shift();
            return;
          })
          .on('finish', function () {
            queue = message.guild.musicData.queue;
            if (message.guild.musicData.loopSong) {
              queue.unshift(message.guild.musicData.nowPlaying);
            } else if (message.guild.musicData.loopQueue) {
              queue.push(message.guild.musicData.nowPlaying);
            }
            if (queue.length >= 1) {
              classThis.playSong(queue, message);
              return;
            } else {
              message.guild.musicData.isPlaying = false;
              message.guild.musicData.nowPlaying = null;
              message.guild.musicData.songDispatcher = null;
              if (
                message.guild.me.voice.channel &&
                message.guild.musicData.skipTimer
              ) {
                message.guild.me.voice.channel.leave();
                message.guild.musicData.skipTimer = false;
                return;
              }
              if (message.guild.me.voice.channel) {
                setTimeout(function onTimeOut() {
                  if (
                    message.guild.musicData.isPlaying == false &&
                    message.guild.me.voice.channel
                  ) {
                    message.guild.me.voice.channel.leave();
                    message.say(
                      ':zzz: Left channel due to inactivity.'
                    );
                  }
                }, 90000);
              }
            }
          })
          .on('error', function (e) {
            message.say(':x: Cannot play song!');
            console.error(e);
            if (queue.length > 1) {
              queue.shift();
              classThis.playSong(queue, message);
              return;
            }
            message.guild.musicData.queue.length = 0;
            message.guild.musicData.isPlaying = false;
            message.guild.musicData.nowPlaying = null;
            message.guild.musicData.loopSong = false;
            message.guild.musicData.songDispatcher = null;
            message.guild.me.voice.channel.leave();
            return;
          });
      })
      .catch(function () {
        message.say(':no_entry: I have no permission to join your channel!');
        message.guild.musicData.queue.length = 0;
        message.guild.musicData.isPlaying = false;
        message.guild.musicData.nowPlaying = null;
        message.guild.musicData.loopSong = false;
        message.guild.musicData.songDispatcher = null;
        if (message.guild.me.voice.channel) {
          message.guild.me.voice.channel.leave();
        }
        return;
      });
  }

  static async searchYoutube(query, message, voiceChannel) {
    const videos = await youtube.searchVideos(query, 5).catch(async function () {
      await message.say(
        ':x: There was a problem searching the video you requested!'
      );
      return;
    });
    if (videos.length < 5 || !videos) {
      message.say(
        `:x: I had some trouble finding what you were looking for, please try again or be more specific.`
      );
      return;
    }
    const vidNameArr = [];
    for (let i = 0; i < videos.length; i++) {
      vidNameArr.push(
        `${i + 1}: [${videos[i].title
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&apos;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")}](${videos[i].shortURL})`
      );
    }
    vidNameArr.push('cancel');
    const embed = new Discord.MessageEmbed()
      .setColor('#FFED00')
      .setTitle(`:mag: Search Results!`)
      .addField(':notes: Result 1', vidNameArr[0])
      .setURL(videos[0].url)
      .addField(':notes: Result 2', vidNameArr[1])
      .addField(':notes: Result 3', vidNameArr[2])
      .addField(':notes: Result 4', vidNameArr[3])
      .addField(':notes: Result 5', vidNameArr[4])
      .setThumbnail(videos[0].thumbnails.high.url)
      .setFooter('Choose a song by commenting a number between 1 and 5')
      .addField(':x: Cancel', 'to cancel ');
    var songEmbed = await message.say({ embed });
    message.channel
      .awaitMessages(
        function (msg) {
          return (
            (msg.content > 0 && msg.content < 6) || msg.content === 'cancel'
          );
        },
        {
          max: 1,
          time: 60000,
          errors: ['time']
        }
      )
      .then(function (response) {
        const videoIndex = parseInt(response.first().content);
        if (response.first().content === 'cancel') {
          songEmbed.delete();
          return;
        }
        youtube
          .getVideoByID(videos[videoIndex - 1].id)
          .then(function (video) {
            // // can be uncommented if you don't want the bot to play live streams
            // if (video.raw.snippet.liveBroadcastContent === 'live') {
            //   songEmbed.delete();
            //   return message.say("I don't support live streams!");
            // }

            // // can be uncommented if you don't want the bot to play videos longer than 1 hour
            // if (video.duration.hours !== 0) {
            //   songEmbed.delete();
            //   return message.say('I cannot play videos longer than 1 hour');
            // }

            // // can be uncommented if you don't want to limit the queue
            // if (message.guild.musicData.queue.length > 10) {
            //   songEmbed.delete();
            //   return message.say(
            //     'There are too many songs in the queue already, skip or wait a bit'
            //   );
            // }
            message.guild.musicData.queue.push(
              PlayCommand.constructSongObj(
                video,
                voiceChannel,
                message.member.user
              )
            );
            if (message.guild.musicData.isPlaying == false) {
              message.guild.musicData.isPlaying = true;
              if (songEmbed) {
                songEmbed.delete();
              }
              PlayCommand.playSong(message.guild.musicData.queue, message);
            } else if (message.guild.musicData.isPlaying == true) {
              if (songEmbed) {
                songEmbed.delete();
              }
              const addedEmbed = new Discord.MessageEmbed()
                .setColor('#FFED00')
                .setTitle(`:musical_note: ${video.title}`)
                .addField(
                  `Has been added to queue. `,
                  `This song is #${message.guild.musicData.queue.length} in queue`
                )
                .setThumbnail(video.thumbnails.high.url)
                .setURL(video.url);
              message.say(addedEmbed);
              return;
            }
          })
          .catch(function () {
            if (songEmbed) {
              songEmbed.delete();
            }
            message.say(
              ':x: An error has occured when trying to get the video ID from youtube.'
            );
            return;
          });
      })
      .catch(function () {
        if (songEmbed) {
          songEmbed.delete();
        }
        message.say(
          ':x: Please try again and enter a number between 1 and 5 or cancel.'
        );
        return;
      });
  }

  static constructSongObj(video, voiceChannel, user) {
    let duration = this.formatDuration(video.duration);
    if (duration == '00:00') duration = ':red_circle: Live Stream';
    return {
      url: `https://www.youtube.com/watch?v=${video.raw.id}` || video.url,
      title: video.title,
      rawDuration: video.duration,
      duration,
      thumbnail: video.thumbnails.high.url || video.thumbnail,
      voiceChannel,
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