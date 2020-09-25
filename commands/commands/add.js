const Discord = require('discord.js')
const client = new Discord.Client()


module.exports = {
  commands: ['add', 'addition'],
  expectedArgs: '<num1> <num2>',
  minArgs: 2,
  maxArgs: 2,
  description: 'Add two numbers',
  callback: (message, arguments, text) => {
    
      let sum = 0
  
      for (const arg of args) {
        sum += parseInt(arg)
      }
  
      
    
    const addEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`The sum is ${sum}`)
    message.reply(addEmbed)
  }
}
