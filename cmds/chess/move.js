const { Chess } = require('chess.js');
const Discord = require('discord.js');
const { inGame, getRating, eloDiffCalc } = require('../../function');
module.exports = {
    name: 'move',
    group: 'games',
    usage: 'move (move)',
    description: 'Move one of your pieces!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        const [a] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        let fen = a[0].fen
        const chess = new Chess(fen)
        if (chess.move(args, { sloppy: true }) === null) {
            return message.reply('Invalid move. Check if the move is legal or if you entered the move with the correct notation.')
        }
        if (!chess.game_over()) {
            fen = chess.fen();
            await client.pool.query(`UPDATE chessGames SET fen = '${fen}' WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            fen = chess.fen();
            const [b] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            message.channel.send('<@' + (chess.turn() === 'w' ? b[0].p1 : b[0].p2) + '>, it is your turn!');
            return message.channel.send(`http://www.jinchess.com/chessboard/?p=${encodeURI(b[0].fen)}&s=l&dsc=%23b58863&lsc=%23f0d9b5&ps=merida&cm=o`);
        }
        const [b] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        if (chess.in_draw() || chess.in_stalemate() || chess.in_threefold_repetition()) {
            message.channel.send('Draw!');
            message.channel.send(`http://www.jinchess.com/chessboard/?p=${encodeURI(b[0].fen)}&s=l&dsc=%23b58863&lsc=%23f0d9b5&ps=merida&cm=o`);
        }
        else {
            message.channel.send(chess.turn() === 'w' ? `<@${b[0].p1}> (white) won!` : `<@${b[0].p2}> (black) won!`);
            message.channel.send(`http://www.jinchess.com/chessboard/?p=${encodeURI(b[0].fen)}&s=l&dsc=%23b58863&lsc=%23f0d9b5&ps=merida&cm=o`);
        }
        const data = {};
        if (b[0].p1 == message.author.id) {
            await client.pool.query(`UPDATE chessGames SET winner = ${b[0].p2}, current = 0 WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            data.winner = b[0].p2
            data.looser = b[0].p1
        }
        else {
            await client.pool.query(`UPDATE chessGames SET winner = ${b[0].p1}, current = 0 WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            data.winner = b[0].p1
            data.looser = b[0].p2
        }
        winnerRating = await getRating(data.winner, client)
        looserRating = await getRating(data.looser, client)
        const takeAway = await eloDiffCalc(winnerRating, looserRating, 1, client)
        await client.pool.query(`UPDATE chessData SET rating = rating + ${takeAway}, wins = wins + 1, totalGames = totalGames + 1 WHERE user = ${data.winner}`)
        await client.pool.query(`UPDATE chessData SET rating = rating - ${takeAway}, losses = losses + 1, totalGames = totalGames + 1  WHERE user = ${data.looser}`)
    }
}