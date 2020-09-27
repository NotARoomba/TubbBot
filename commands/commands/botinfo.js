const Discord = require('discord.js')
const client = new Discord.Client()

const { version } = require('@root/package.json')
const { prefix } = require('@root/config.json')


module.exports = {
    commands: 'sys',
    minArgs: 0,
    maxArgs: 0,
    description: 'Sysinfo.exe',
    callback: async (message, arguments, text) => {
        
    let totalMembers = 0
        
    const guild = client.guilds.cache
    totalMembers += (await guild[1].members.cache.fetch()).size


const embed = new Discord.MessageEmbed()
.setAuthor(
  `Information about Tubb`,
  this.client.user.displayAvatarURL()
)
.addFields(
  {
    name: 'Bot tag',
    value: client.user.tag,
  },
  {
    name: 'Version',
    value: version,
  },
  {
    name: "Server's command prefix",
    value: prefix,
  },
  {
    name: 'Time since last restart',
    value: `${process.uptime().toFixed(2)}s`,
  },
  {
    name: 'Server count',
    value: client.guilds.cache.size,
  },
  {
    name: 'Total members',
    value: totalMembers,
  }
)

message.channel.send(embed)
    }
}