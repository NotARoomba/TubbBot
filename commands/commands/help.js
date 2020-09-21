const loadCommands = require('@root/commands/load-commands')
const { prefix } = require('@root/config.json')
const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
  commands: ['help', 'h'],
  description: "Describes all of this bot's commands",
  callback: (message, arguments, text) => {
    
    const helpEmbed = new Discord.MessageEmbed()
    .setColor('#C0C0C0')
    .setTitle(`Help`)
    .setDescription('I am TUBB (The Utility (B*tch) Bot):\n\n')

    let reply = helpEmbed

    const commands = loadCommands()

    for (const command of commands) {
      // Check for permissions
      let permissions = command.permission

      if (permissions) {
        let hasPermission = true
        if (typeof permissions === 'string') {
          permissions = [permissions]
        }

        for (const permission of permissions) {
          if (!message.member.hasPermission(permission)) {
            hasPermission = false
            break
          }
        }

        if (!hasPermission) {
          continue
        }
      }

      // Format the text
      const mainCommand =
        typeof command.commands === 'string'
          ? command.commands
          : command.commands[0]
      const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
      const { description } = command
      
      const help2Embed = new Discord.MessageEmbed()
      .setColor('#C0C0C0')
      .setTitle(`Help`)
      .setDescription(`**${prefix}${mainCommand}${args}** = ${description}\n`)
       
    }

    message.channel.send(reply += help2Embed) 
  },
}