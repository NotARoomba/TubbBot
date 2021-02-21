const Discord = require('discord.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.DBUSER}:${process.env.DBPASS}@freedb.tech:3306/${process.env.DBNAME}`, {
    logging: false
})
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
        const filters = [
            "bassboost",
            "8D",
            "vaporwave",
            "nightcore",
            "phaser",
            "tremolo",
            "vibrato",
            "reverse",
            "treble",
            "normalizer",
            "surrounding",
            "pulsator",
            "subboost",
            "karaoke",
            "flanger",
            "gate",
            "haas",
            "mcompand",
            "mono",
            "mstlr",
            "mstrr",
            "compressor",
            "expander",
            "softlimiter",
            "chorus",
            "chorus2d",
            "chorus3d",
            "fadein",
        ];
        let varforfilter; let choice;
        switch (args) {
            case "bassboost":
                varforfilter = 0;
                break;
            case "8D":
                varforfilter = 1;
                break;
            case "vaporwave":
                varforfilter = 2;
                break;
            case "nightcore":
                varforfilter = 3;
                break;
            case "phaser":
                varforfilter = 4;
                break;
            case "tremolo":
                varforfilter = 5;
                break;
            case "vibrato":
                varforfilter = 6;
                break;
            case "reverse":
                varforfilter = 7;
                break;
            case "treble":
                varforfilter = 8;
                break;
            case "normalizer":
                varforfilter = 9;
                break;
            case "surrounding":
                varforfilter = 10;
                break;
            case "pulsator":
                varforfilter = 11;
                break;
            case "subboost":
                varforfilter = 12;
                break;
            case "karaoke":
                varforfilter = 13;
                break;
            case "flanger":
                varforfilter = 14;
                break;
            case "gate":
                varforfilter = 15;
                break;
            case "haas":
                varforfilter = 16;
                break;
            case "mcompand":
                varforfilter = 17;
                break;
            case "mono":
                varforfilter = 18;
                break;
            case "mstlr":
                varforfilter = 19;
                break;
            case "mstrr":
                varforfilter = 20;
                break;
            case "compressor":
                varforfilter = 21;
                break;
            case "expander":
                varforfilter = 22;
                break;
            case "softlimiter":
                varforfilter = 23;
                break;
            case "chorus":
                varforfilter = 24;
                break;
            case "chorus2d":
                varforfilter = 25;
                break;
            case "chorus3d":
                varforfilter = 26;
                break;
            case "fadein":
                varforfilter = 27;
                break;
            default:
                varforfilter = 404;
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
    }
}