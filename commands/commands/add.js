
module.exports = {
  commands: ['add', 'addition'],
  expectedArgs: '<num1> <num2>',
  minArgs: 2,
  maxArgs: 2,
  cooldown: 10,
  description: 'Add two numbers',
  callback: (message, arguments, text) => {
    const { guild } = message

    const num1 = +arguments[0]
    const num2 = +arguments[1]
    const addEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`The sum is ${num1 + num2}`)
    message.reply(addEmbed)
  },
}