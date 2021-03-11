const Discord = require('discord.js');
var BigEval = require('bigeval')
module.exports = {
    name: "calculator",
    group: 'utility',
    usage: `calc (expression)`,
    aliases: ['calc'],
    description: 'Get the answer to a math problem.',
    async execute(message, args) {
        try {
            message.channel.send(`\`\`\`${await calc(args)}\`\`\``)
            async function calc(equation) {
                return new BigEval().exec(equation);
            }
        } catch (err) {
            message.reply(`An error occured \`${err}\``)
        }
    }
}