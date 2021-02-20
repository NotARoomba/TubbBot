module.exports = {
    name: 'volume',
    aliases: ['v', 'vol'],
    description: 'Adjust song volume!',
    async execute(message, args, client) {
        let queue = client.player.getQueue(message)
        if (isNaN(Number(args))) return message.reply(`that is not a number.`)
    }
}