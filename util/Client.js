const os = require('os');
const Collection = require('@discordjs/collection');
var winston = require('winston');
require('winston-syslog');
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
        const papertrail = new winston.transports.Syslog({
            host: 'logs.collector.solarwinds.com',
            port: process.env.PORT,
            protocol: 'tls4',
            localhost: os.hostname(),
            eol: '\n',
        });
        this.logger = winston.createLogger({
            format: winston.format.simple(),
  levels: winston.config.syslog.levels,
            transports: [papertrail],

        });
        this.games = new Collection();
    }
}