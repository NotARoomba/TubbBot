module.exports = {
    name: 'messagedel',
    aliases: 'msgdel',
    description: 'Mass (message) Genocide',
    async execute(message, count) {
        try {
            if (count > 99 || count == '') count = 99;
            count = parseInt(count) + 1
            const messages = await message.channel.messages.fetch({ limit: count });
            await message.channel.bulkDelete(messages, false);
            return null;
        } catch (err) {
            console.log(err)
            return message.reply(`There are some messages older than two weeks that can't be deleted.`);
        }
    }
}