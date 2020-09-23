const Discord = require('discord.js');
const economy = require('@features/economy')
const client = new Discord.Client()

module.exports = {
  commands: ['balance', 'bal'],
  maxArgs: 1,
  description: 'Check your d̶e̶b̶t̶  balance',
  expectedArgs: "[Target user's @]",
  callback: async (message) => {
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildId = message.guild.id
    const userId = target.id

    const strands = await economy.getCoins(guildId, userId)

    const balEmbed = new Discord.MessageEmbed()
        .setColor('#000080')
        .setTitle(`Balance`)
<<<<<<< HEAD
        .setDescription(`Your balance is ${tools} Tools!`)
=======
        .setDescription(`Your balance is ${strands} Strands!`)
>>>>>>> parent of 571098a... jbk.
      message.reply(balEmbed)
  },
}
