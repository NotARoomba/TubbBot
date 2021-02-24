module.exports = {
    name: 'evaluation',
    group: 'utility',
    usage: `eval (code)`,
    aliases: ['eval'],
    description: 'Useful for debugging.',
    async execute(message, args) {
        if (message.author.id === "465917394108547072") {
            try {
                let evaled = eval(args);
                message.channel.send(`\`\`\`${evaled}\`\`\``)
            }
            catch (err) {
                console.log(err);
            }
        } else {
            message.reply("You cant do that!")
        }
    }
}