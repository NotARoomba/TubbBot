var ChessImageGenerator = require('chess-image-generator');
var imageGenerator = new ChessImageGenerator({
    size: 1200,
    style: 'cburnett'
});
const { inGame } = require('../../function');
const imgurUploader = require('imgur-uploader');
module.exports = {
    name: 'board',
    group: 'games',
    usage: 'board',
    aliases: ['b'],
    description: 'Gets the board of the current game!',
    async execute(message, args, client) {
        if (!await inGame(message, message.author, client)) return message.reply(`you are not in a game.`)
        const [game] = await client.pool.query(`SELECT * FROM chessGames WHERE guild = ${message.guild.id} AND p1 = ${message.author.id} or p2 = ${message.author.id} AND current = 1`)
        imageGenerator.loadFEN(`${game[0].fen}`)
        imageGenerator.generateBuffer().then(async (imageBuffer) => {
            const image = await imgurUploader(imageBuffer)
            message.channel.send(image.link)
        })
    }
}