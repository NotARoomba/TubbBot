const os = require('os');
const Collection = require('@discordjs/collection');
var winston = require('winston');
require('winston-papertrail').Papertrail;
const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
Structures.extend('Guild', function (Guild) {
    class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                songDispatcher: null,
                skipTimer: false, // only skip if user used leave command
                loopSong: false,
                loopQueue: false,
                volume: 1
            };
        }
    }
    return MusicGuild;
});

module.exports = class TubbClient extends CommandoClient {
    constructor(options) {
        super(options);
        var winstonPapertrail = new winston.transports.Papertrail({
            host: 'logs3.papertrailapp.com',
            port: process.env.PORT
          })
          
          winstonPapertrail.on('error', function(err) {
            // Handle, report, or silently ignore connection errors and failures
          });
        
          var logger = new winston.Logger({
            transports: [winstonPapertrail]
          });
        this.games = new Collection();
    }
}