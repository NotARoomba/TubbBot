const Discord = require('discord.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.DBUSER}:${process.env.DBPASS}@freedb.tech:3306/${process.env.DBNAME}`, {
    logging: false
})
const filters = require('discord-player').Player.AudioFilters
module.exports = {
    name: 'filters',
    aliases: ['filter'],
    description: 'Adds a filter to the current song!',
    async execute(message, args, client) {
        const Prefix = sequelize.define('prefix', {
            guild: Sequelize.STRING,
            prefix: Sequelize.STRING
        })
        const prefix = await Prefix.findOne({ where: { guild: message.guild.id } })
        switch (args) {
            case "bassboost":
                choice = { bassboost: true }
                break;
            case "8D":
                choice = { '8D': true }
                break;
            case "vaporwave":
                choice = { vaporwave: true }
                break;
            case "nightcore":
                choice = { nightcore: true }
                break;
            case "phaser":
                choice = { phaser: true }
                break;
            case "tremolo":
                choice = { tremolo: true }
                break;
            case "vibrato":
                choice = { vibrato: true }
                break;
            case "reverse":
                choice = { reverse: true }
                break;
            case "treble":
                choice = { treble: true }
                break;
            case "normalizer":
                choice = { normalizer: true }
                break;
            case "surrounding":
                choice = { surrounding: true }
                break;
            case "pulsator":
                choice = { pulsator: true }
                break;
            case "subboost":
                choice = { subboost: true }
                break;
            case "karaoke":
                choice = { karaoke: true }
                break;
            case "flanger":
                choice = { flanger: true }
                break;
            case "gate":
                choice = { gate: true }
                break;
            case "haas":
                choice = { haas: true }
                break;
            case "mcompand":
                choice = { mcompand: true }
                break;
            case "mono":
                choice = { mono: true }
                break;
            case "mstlr":
                choice = { mstlr: true }
                break;
            case "mstrr":
                choice = { mstrr: true }
                break;
            case "compressor":
                choice = { compressor: true }
                break;
            case "expander":
                choice = { expander: true }
                break;
            case "softlimiter":
                choice = { softlimiter: true }
                break;
            case "chorus":
                choice = { chorus: true }
                break;
            case "chorus2d":
                choice = { chorus2d: true }
                break;
            case "chorus3d":
                choice = { chorus3d: true }
                break;
            case "fadein":
                choice = { fadein: true }
                break;
            case "clear":
                choice = {
                    bassboost: false,
                    '8D': false,
                    vaporwave: false,
                    nightcore: false,
                    phaser: false,
                    tremolo: false,
                    vibrato: false,
                    reverse: false,
                    treble: false,
                    normalizer: false,
                    surrounding: false,
                    pulsator: false,
                    subboost: false,
                    karaoke: false,
                    flanger: false,
                    gate: false,
                    haas: false,
                    mcompand: false,
                    mono: false,
                    mstlr: false,
                    mstrr: false,
                    compressor: false,
                    expander: false,
                    softlimiter: false,
                    chorus: false,
                    chorus2d: false,
                    chorus3d: false,
                    fadein: false
                }
                break;
            default:
                choice = 404;
                const embed = new Discord.MessageEmbed()
                    .setColor("#c219d8")
                    .setTitle("Not a valid Filter, use one of those:")
                    .setDescription(`
                \`bassboost\`
                \`8D\`
                \`vaporwave\`
                \`nightcore\`
                \`phaser\`
                \`tremolo\`
                \`vibrato\`
                \`reverse\`
                \`treble\`
                \`normalizer\`
                \`surrounding\`
                \`pulsator\`
                \`subboost\`
                \`karaoke\`
                \`flanger\`
                \`gate\`
                \`haas\`
                \`mcompand\`
                \`mono\`
                \`mstlr\`
                \`mstrr\`
                \`compressor\`
                \`expander\`
                \`softlimiter\`
                \`chorus\`
                \`chorus2d\`
                \`chorus3d\`
                \`fadein\`
                \`clear\`   ---  removes all filters`)
                    .setFooter(`Example: ${prefix.prefix}filter bassboost`)
                message.channel.send(embed)
                break;
        }
        if (choice === 404) return;
        try {
            client.player.setFilters(message, choice);
        } catch (err) { }
    }
}