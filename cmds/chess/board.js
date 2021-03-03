const { inGame, getBoardImage } = require('../../function');
module.exports = {
    name: 'board',
    group: 'games',
    usage: 'board',
    aliases: ['b'],
    description: 'Gets the board of the current game!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        const [game] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        message.channel.send(await getBoardImage(game[0].fen))
    }
}