const Discord = require('discord.js')
const commandBase = require('@root/commands/command-base')
const client = new Discord.Client()
//const summoned = '427630841045319701'

module.exports = {
    commands: 'summon',
    maxArgs: 1,
    description: '*Holy Music stops*',
    expectedArgs: "[Target user's @]",
    callback: (message) => {
        const target = message.mentions.users.first()

      
      const balusrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription('Please tag a user to Summon.')
            if (!target) {
      
      message.say(balusrEmbed)
                return
            }

        const summonEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setTitle(`Ritual of Summon`)
        .setDescription(`${target}`)
        

    message.say(summonEmbed)  

    const summoningEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setDescription(`${target}`)
        

    message.say(summoningEmbed)
    message.say(summoningEmbed)
    message.say(summoningEmbed)
    message.say(summoningEmbed) 
    }
}