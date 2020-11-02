const Discord = require('discord.js')
const client = new Discord.Client()

const { version } = require('@root/package.json')
const { prefix } = require('@root/config.json')
const tag = `750123677739122819`
const activities = require('@root/index.js')
const mongo = require('@util/mongo')
const commandPrefixSchema = require('@schemas/command-prefix-schema')
const { prefix: globalPrefix } = require('@root/config.json')
const guildPrefixes = {} 


module.exports = {
    commands: 'sys',
    minArgs: 0,
    maxArgs: 0,
    description: 'Sysinfo.exe',
    callback: async (message, arguments, text) => {
          
      const prefix = guildPrefixes[guild.id] || globalPrefix
        
      module.exports.updateCache = (guildId, newPrefix) => {
        guildPrefixes[guildId] = newPrefix
      }
      
      module.exports.loadPrefixes = async (client) => {
        await mongo().then(async (mongoose) => {
          try {
            for (const guild of client.guilds.cache) {
              const guildId = guild[1].id
      
              const result = await commandPrefixSchema.findOne({ _id: guildId })
              guildPrefixes[guildId] = result ? result.prefix : globalPrefix
            }
      
            console.log(guildPrefixes)
          } finally {
            mongoose.connection.close()
  }
})
      }



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
    name: "Servers's command prefix",
    value: guildPrefixes,
  },
  {
    name: 'Time since last restart',
    value: `${process.uptime().toFixed(2) / 60 / 60}h`,
  },
  {
    name: 'Server count',
    value: `Look at status =>`,
  },
  {
    name: 'Total members',
    value: `${message.guild.memberCount}`,
  }
)

message.channel.send(embed)
    }
    
}

