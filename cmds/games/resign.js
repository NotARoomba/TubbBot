const { inGame, endChessGame } = require('../../function');
module.exports = {
    name: 'resign',
    group: 'chess',
    usage: 'resign',
    description: 'Resign youtr chess match!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        const [game] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        if (game[0].p1 == message.author.id) {
            await endChessGame(message, client, game[0].p2, game[0].p1, 1)
            return message.channel.send(`${message.author} has resigned, <@${game[0].p2}> has won the match.`)
        } else {
            await endChessGame(message, client, game[0].p1, game[0].p2, 1)
            return message.channel.send(`${message.author} has resigned, <@${game[0].p1}> has won the match.`)
        }
    }
}