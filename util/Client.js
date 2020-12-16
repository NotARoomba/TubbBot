const Collection = require('@discordjs/collection');
const winston = require('winston');
const { CommandoClient } = require('discord.js-commando');
module.exports = class TubbClient extends CommandoClient {
    constructor(options) {
        super(options);

        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({ filename: `commands.log`, level: `info` }),
                new winston.transports.File({ filename: `error.log`, level: `error` })],
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
                winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
            )

        });
        this.games = new Collection();
    }
}