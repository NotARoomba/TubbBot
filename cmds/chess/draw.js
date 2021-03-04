const { inGame, endChessGame } = require('../../function');
module.exports = {
    name: 'draw',
    group: 'games',
    usage: 'board',
    description: 'Offers a draw to the opposing player!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        try {
            const [a] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            let mesg = await message.channel.send(`<@${a[0].p2}>, <@${a[0].p1}> is offering a draw, do you accept?`)
            await mesg.react('✅')
            await mesg.react('❌')
            const filter = (reaction, b) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && b.id.includes(a[0].p2);
            };
            const collector = await mesg.createReactionCollector(filter, { time: 30000 });
            collector.on('collect', async (reaction) => {
                if (reaction.emoji.name === '✅') {
                    const [b] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
                    message.channel.send(`Draw agreed to between <@${b[0].p1}> and <@${b[0].p2}>!`);
                    message.channel.send(`http://www.jinchess.com/chessboard/?p=${encodeURI(b[0].fen)}&s=l&dsc=%23b58863&lsc=%23f0d9b5&ps=merida&cm=o`)
                    await endChessGame(message, client, b[0].p1, b[0].p2, .5, true)
                } else if (reaction.emoji.name === '❌') {
                    message.channel.send(`<@${a[0].p2}> has **declined** the draw, the game continues!`)
                }
            })
            collector.on('end', collected => {
                if (collected.size == 0) message.channel.send(`Looks like they declined the draw offer...`)
            });
            return
        } catch (err) {
            console.log(err)
        }
    }
}