const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
const { version } = require('@root/package.json')

module.exports = class BotInfoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'sys',
      group: 'utility',
      memberName: 'sys',
      description: 'Displays bot information',
    })
  }

  run = async (message) => {
    let totalMembers = 0

    for (const guild of this.client.guilds.cache) {
      totalMembers += (await guild[1].members.fetch()).size
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `Information about Tubb`,
        this.client.user.displayAvatarURL()
      )
      .addFields(
        {
          name: 'Bot tag',
          value: this.client.user.tag,
        },
        {
          name: 'Version',
          value: version,
        },
        {
          name: "Server's command prefix",
          value: message.guild.commandPrefix,
        },
        {
          name: 'Time since last restart',
          value: `${process.uptime().toFixed(2) / 60 / 60}h`,
        },
        {
          name: 'Server count',
          value: this.client.guilds.cache.size,
        },
        {
          name: 'Total members',
          value: totalMembers,
        },
        {
          name: 'Invite me!',
          value: `[Invite me!](https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D%5B750123677739122819%5D%26scope%3Dbot&scope=bot)`
        }
      )

    message.channel.send(embed)
    console.log(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
  }
}