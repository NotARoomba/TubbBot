const { Chess } = require('chess.js');
const { inGame, hasData } = require('../../function');
module.exports = {
    name: 'chess',
    group: 'games',
    usage: 'chess (player)',
    aliases: ['challenge'],
    description: 'Play chessa against someone!',
    async execute(message, args, client) {
        let accepted
        const user = message.mentions.users.first();
        if (user == undefined) return message.reply(`you didn't provide a valid user.`)
        if (user.bot) return message.reply('bots cannot be played against.');
        if (user.id === message.author.id) return message.reply('you cannot play against yourself.');
        if (await inGame(message, message.author, client)) return message.reply(`you are already in a game.`)
        if (await inGame(message, user, client)) return message.reply(`the person you are trying to challenge is already in a game.`)
        try {
            await message.react('✅')
            await message.react('❌')
            const filter = (reaction, b) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && b.id.includes(user.id);
            };
            const collector = await message.createReactionCollector(filter, { time: 30000 });
            collector.on('collect', (reaction) => {
                if (reaction.emoji.name === '✅') {
                    message.channel.send(`${user} has **accepted** the challenge!`)
                    accepted = true
                } else if (reaction.emoji.name === '❌') {
                    message.channel.send(`${user} has **declined** the challenge!`)
                    accepted = false
                }
            })
            if (accepted == false) return
            const chess = new Chess()
            if (!await hasData(message.author, client)) await client.pool.query(`INSERT INTO chessData (user) VALUES ('${message.author.id}')`)
            if (!await hasData(user, client)) await client.pool.query(`INSERT INTO chessData (user) VALUES ('${user.id}')`)
            await client.pool.query(`INSERT INTO chessGames (guild, p1, p2, fen) VALUES ('${message.guild.id}','${message.author.id}','${user.id}','${chess.fen()}')`)
        } catch (err) {
            console.log(err)
        }
    }
}