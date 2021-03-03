const { inGame, getRating, eloDiffCalc } = require('../../function');
module.exports = {
    name: 'resign',
    group: 'games',
    usage: 'resign',
    description: 'Resign youtr chess match!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        const [game] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        const data = {};
        if (game[0].p1 == message.author.id) {
            await client.pool.query(`UPDATE chessGames SET winner = ${game[0].p2}, current = 0 WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            data.winner = game[0].p2
            data.looser = game[0].p1
            message.channel.send(`${message.author} has resigned, <@${game[0].p2}> has won the match.`)
        }
        else {
            await client.pool.query(`UPDATE chessGames SET winner = ${game[0].p1}, current = 0 WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            data.winner = game[0].p1
            data.looser = game[0].p2
            message.channel.send(`${message.author} has resigned, <@${game[0].p1}> has won the match.`)
        }
        winnerRating = await getRating(data.winner, client)
        looserRating = await getRating(data.looser, client)
        const takeAway = await eloDiffCalc(winnerRating, looserRating, 1, client)
        await client.pool.query(`UPDATE chessData SET rating = rating + ${takeAway}, wins = wins + 1, totalGames = totalGames + 1 WHERE user = ${data.winner}`)
        await client.pool.query(`UPDATE chessData SET rating = rating - ${takeAway}, losses = losses + 1, totalGames = totalGames + 1  WHERE user = ${data.looser}`)
    }
}