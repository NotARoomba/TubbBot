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
            host: 'logs3.papertrailapp.com',
            port: process.env.PORT,
            protocol: 'tls4',
            localhost: os.hostname(),
            eol: '\n',
        });
        this.logger = winston.createLogger({
            transports: [papertrail],
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
                winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
            )

        });
        this.games = new Collection();
    }
}