require('module-alias/register');
require('events').EventEmitter.prototype._maxListeners = 100;
const Discord = require('discord.js')
const client = new Discord.Client
const mongo = require('@util/mongo');
const loadCommands = require('@root/commands/load-commands.js')
const loadFeatures = require('@root/features/load-features.js')
const dtoken = require('@root/config.json')
client.queue = new Map();

//const client = new Commando.CommandoClient({
//  owner: '251120969320497152',
//  commandPrefix: config.prefix,
//})



client.on('ready',  async () => {
  console.log('Tubb is online!')
  setInterval(() => {
    client.user.setActivity(`-help in ${client.guilds.cache.size} Servers | Made by L061571C5#5281`, { type: 'WATCHING' })
}, 60000);

  await mongo().then(mongoose => {
    try {
      console.log('Connected to Mongo!')
    } finally {
      mongoose.connection.close()
    }

  })

  loadCommands(client)
 loadFeatures(client)

});
client.on('message',  message => {
    if (message.author.bot) return false;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

    if (message.mentions.has(client.user.id)) {
  message.reply("Use -help for a list of commands!");
};
})
client.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  const Invite = new Discord.MessageEmbed()
  .setTitle(`Thank you for inviting me to \`\`${guild.name}\`\`!`)
  .addFields(
      {
          name: `My default prefix is`,
          value: `\`\`-\`\` but you can always change it by running -setprefix (New Prefix)`,
          inline: true,
      },
      {
          name: `My commands`,
          value: `I would recomend trying -help or -commands!`,
          inline: true,
      },
      {
          name: `If you want to invite me to your server please click Invite me!`,
          value: `[Invite me!] https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D%5B750123677739122819%5D%26scope%3Dbot&scope=bot`, // This is optional if you want over people to invite your bot to different servers!
          inline: true,
      },
      {
        name: `PSA`,
        value: `This bot may be buggy at times`,
        inline: true,
    },
  )
  .setFooter(`And a special thanks from the creator of ${client.user.username}`)
  channel.send(Invite)
})

//heroku stack:set heroku-18 -a tubb-bot jic v509
client.login('NzUwMTIzNjc3NzM5MTIyODE5.X019HQ.USGz-7328iyyiA9UoGPTqZeU4xI')
client.login(process.env.token)

