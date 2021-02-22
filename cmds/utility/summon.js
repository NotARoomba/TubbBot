module.exports = {
    name: 'summon',
    group: 'utility',
    description: '*Holy Music stops*',
    execute(message) {
        const user = message.mentions.users.first();
        if (user == undefined) return message.reply(`you didn't provide a valid user.`)
        message.channel.send(`Summoning ${user}`)
        message.channel.send(`${user}`)
        message.channel.send(`${user}`)
        message.channel.send(`${user}`)
        message.channel.send(`${user}`)
    }
}