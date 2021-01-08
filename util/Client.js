const Collection = require('@discordjs/collection');
var winston = require('winston');
require('winston-syslog')
const localhost = require("os").hostname
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
                connection: null,
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
        const option = {
            host: 'logs3.papertrailapp.com',
            port: process.env.PORT,
            app_name: "Tubb",
            localhost: localhost
        }
        this.logger = winston.createLogger();
        this.logger.add(new winston.transports.Syslog(option))
        this.games = new Collection();
    }
}