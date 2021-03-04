const { inGame, endChessGame } = require('../../function');
module.exports = {
    name: 'draw',
    group: 'games',
    usage: 'board',
    description: 'Offers a draw to the opposing player!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        try {
            let accepted;
            await message.react('✅')
            await message.react('❌')
            const filter = (reaction, b) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && b.id.includes(user.id);
            };
            const collector = await message.createReactionCollector(filter, { time: 30000 });
            collector.on('collect', (reaction) => {
                if (reaction.emoji.name === '✅') {
                    message.channel.send(`${user} has **accepted** the draw!`)
                    accepted = true
                } else if (reaction.emoji.name === '❌') {
                    message.channel.send(`${user} has **declined** the draw, the game continues!`)
                    accepted = false
                }
            })
            collector.on('end', collected => {
                if (collected.size == 0) message.channel.send(`Looks like they declined the draw offer...`)
            });
            if (accepted == false) return
            const [a] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            message.channel.send(`Draw agreed to between <@${a[0].p1}> and <@${a[0].p2}>!`);
            message.channel.send(`http://www.jinchess.com/chessboard/?p=${encodeURI(a[0].fen)}&s=l&dsc=%23b58863&lsc=%23f0d9b5&ps=merida&cm=o`)
            endChessGame(message, client, b[0].p1, b[0].p2, .5, true)
        } catch (err) {
            console.log(err)
        }
    }
}