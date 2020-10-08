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
      setInterval(function () {    
    let totalMembers = 0
        

    const memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)


const embed = new Discord.MessageEmbed()
.setAuthor(
  `Information about Tubb`,
  `https://sciencerack.com/wp-content/uploads/2018/06/utility-programs.png`
)
.addFields(
  {
    name: 'Bot tag',
    value: client.user,
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
    value: memberCount,
  }
)

message.channel.send(embed)
    }
    )
}
}
