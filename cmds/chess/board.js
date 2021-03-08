const { Chess } = require('chess.js');
const { inGame } = require('../../function');
module.exports = {
    name: 'board',
    group: 'chess',
    usage: 'board',
    aliases: ['b'],
    description: 'Gets the board of the current game!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        const [game] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        let fen = game[0].fen
        const chess = new Chess(fen)
        message.channel.send(chess.turn() === 'w' ? `White to move...` : `Black to move...`)
        message.channel.send(`http://www.jinchess.com/chessboard/?p=${encodeURI(game[0].fen)}&s=l&dsc=%23b58863&lsc=%23f0d9b5&ps=merida&cm=o`)
    }
}