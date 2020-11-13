const Discord = require('discord.js')
const client = new Discord.Client()

const { version } = require('@root/package.json')
const { prefix } = require('@root/config.json')
const tag = `750123677739122819`




module.exports = {
    commands: 'sys',
    minArgs: 0,
    maxArgs: 0,
    description: 'Sysinfo.exe',
    callback: async (message, arguments, text) => {
          




const embed = new Discord.MessageEmbed()
.setAuthor(
  `Information about Tubb`,
  `https://sciencerack.com/wp-content/uploads/2018/06/utility-programs.png`
)
.addFields(
  {
    name: 'Bot tag',
    value: tag,
  },
  {
    name: 'Version',
    value: version,
  },
  {
    name: "Tubb's command prefix",
    value: prefix,
  },
  {
    name: 'Time since last restart',
    value: `${process.uptime().toFixed(2) / 60 / 60}h`,
  },
  {
    name: 'Server count',
    value: `${client.guilds.cache.size}`,
  },
  {
    name: 'Total members',
    value: `${message.guild.memberCount}`,
  }
)

message.channel.send(embed)
    }
    
}
