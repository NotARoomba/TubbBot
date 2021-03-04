const { Chess } = require('chess.js');
const Discord = require('discord.js');
const { inGame, getBoardImage } = require('../../function');
module.exports = {
    name: 'move',
    group: 'games',
    usage: 'move (move)',
    description: 'Move one of your pieces!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        const [game] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        let fen = game[0].fen
        const chess = new Chess(fen)
        if (chess.move(args, { sloppy: true }) === null) {
            return message.reply('Invalid move. Check if the move is legal or if you entered the move with the correct notation.')
        }
        if (!chess.game_over()) {
            fen = chess.fen();
            await client.pool.query(`UPDATE chessGames SET fen = '${fen}' WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
            const embed = new Discord.MessageEmbed()
                .setImage(await getBoardImage(game[0].fen))
                .setDescription('<@' + (chess.turn() === 'w' ? game[0].p1 : game[0].p2) + '>, it is your turn!');
            return message.channel.send(embed);
        }
    }
}