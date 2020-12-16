const Collection = require('@discordjs/collection');
var winston = require('winston');
require('winston-mongodb');
const { CommandoClient } = require('discord.js-commando');
module.exports = class TubbClient extends CommandoClient {
    constructor(options) {
        super(options);

        this.logger = winston.createLogger({
            transports: [
                new winston.transports.MongoDB({ db: process.env.MONGO, name: `commands.log`, level: `info` }),
                new winston.transports.MongoDB({ db: process.env.MONGO, name: `error.log`, level: `error` })],
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
                winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
            )

        });
        this.games = new Collection();
    }
}