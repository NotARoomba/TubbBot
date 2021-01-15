const moment = require("moment");
require("moment-duration-format")(moment);
const ID = require("@util/function.js");
const PlayCommand = require('./play')
const youtube = new Youtube(process.env.YOUTUBE_API);
module.exports = class SearchSongCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'search',
            memberName: 'search',
            group: 'music',
            description: 'Search a song from youtube!',
            guildOnly: true,
            args: [
                {
                    key: 'query',
                    prompt:
                        'What would you like to search for?',
                    type: 'string'
                }
            ]
        });
    }
    run(message, { query }) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.say('Please join a voice channel and try again!');
            return;
        }
        SearchSongCommand.searchYoutube(query, message, voiceChannel)
    }
    static async searchYoutube(query, message, voiceChannel) {
        const videos = await youtube.searchVideos(query, 10).catch(async function () {
            await message.say(
                'There was a problem searching the video you requested!'
            );
            return;
        });
        if (videos.length < 5 || !videos) {
            message.say(
                `I had some trouble finding what you were looking for, please try again or be more specific.`
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
            .addField(':notes: Result 5', vidNameArr[5])
            .addField(':notes: Result 5', vidNameArr[6])
            .addField(':notes: Result 5', vidNameArr[7])
            .addField(':notes: Result 5', vidNameArr[8])
            .addField(':notes: Result 5', vidNameArr[9])
            .setThumbnail(videos[0].thumbnails.high.url)
            .setFooter('Choose a song by commenting a number between 1 and 10')
            .addField('Cancel', 'to cancel ');
        var songEmbed = await message.channel.send({ embed });
        message.channel
            .awaitMessages(
                function (msg) {
                    return (
                        (msg.content > 0 && msg.content < 11) || msg.content === 'cancel'
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
                        var duration = video.duration == 0 ? ":red_circle: Live Stream" : moment.duration(video.duration, "seconds").format();
                        //console.log(video.raw.id)
                        message.guild.musicData.queue.push({
                            id: video.raw.id,
                            title: video.title,
                            url: `https://www.youtube.com/watch?v=${video.raw.id}`,
                            type: 0,
                            time: duration,
                            thumbnail: video.thumbnails.high.url,
                            voiceChannel: voiceChannel,
                            isLive: video.duration == 0,
                            memberDisplayName: message.member.user.username,
                            memberAvatar: message.member.user.avatarURL('webp', false, 16)
                        });
                        if (message.guild.musicData.isPlaying == false) {
                            message.guild.musicData.isPlaying = true;
                            PlayCommand.playSong(message.guild.musicData.queue, message);
                        } else if (message.guild.musicData.isPlaying == true) {
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
                            'An error has occured when trying to get the video ID from youtube.'
                        );
                        return;
                    });
            })
            .catch(function () {
                if (songEmbed) {
                    songEmbed.delete();
                }
                message.say(
                    'Please try again and enter a number between 1 and 5 or cancel.'
                );
                return;
            });
    }
}
