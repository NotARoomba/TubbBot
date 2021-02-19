module.exports = {
    name: 'messagedel',
    aliases: ['msgdel'],
    description: 'Mass (message) Genocide',
    async execute(message, count) {
        try {
            const deleteCount = parseInt(count, 10);
            message.channel.bulkDelete(deleteCount || 100)
                .catch(console.error);
        } catch (err) {
            console.log(err)
            return message.reply(`There are some messages older than two weeks that can't be deleted.`);
        }
    }
}