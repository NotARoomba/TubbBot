module.exports = {
    name: 'evaluation',
    group: 'utility',
    usage: `eval (code)`,
    aliases: ['eval'],
    ownerOnly: true,
    description: 'Useful for debugging.',
    async execute(message, args) {
        try {
            let evaled = eval(args);
            message.channel.send(`\`\`\`${evaled}\`\`\``)
        }
        catch (err) {
            message.channel.send(`\`\`\`${err}\`\`\``);
        }
    }
}