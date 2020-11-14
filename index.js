require('module-alias/register');
require('events').EventEmitter.prototype._maxListeners = 100;
const { Structures, Discord } = require('discord.js');
const { MongoClient } = require('mongodb')
const MongoDBProvider = require('commando-provider-mongo')
//const client = new Discord.Client
const mongo = require('@util/mongo');
const db = require('quick.db');
const loadCommands = require('@root/commands/load-commands.js')
const loadFeatures = require('@root/features/load-features.js')


const path = require('path');
//client.queue = new Map();

const { CommandoClient } = require('discord.js-commando');
Structures.extend('Guild', function(Guild) {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        skipTimer: false, // only skip if user used leave command
        loopSong: false,
        loopQueue: false,
        volume: 1
      };
    }
  }
  return MusicGuild;
});


const client = new CommandoClient({
  owner: '465917394108547072',
  commandPrefix: '-',

})
client.setProvider(
  MongoClient.connect('mongodb+srv://L061571C5:89euzXX8IylP1DYn@tubbbot.kfqqn.mongodb.net/data?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
    .then((client) => {
      return new MongoDBProvider(client, 'data')
    })
    .catch((err) => {
      console.error(err)
    })
)


client.on('ready',  async (member) => {
  console.log('Tubb is online!') 
  setInterval(() => {
    client.user.setActivity(`-help in ${client.guilds.cache.size} Servers | Made by L061571C5#5281`, { type: 'WATCHING' })
}, 60000);


  await mongo()
  
  

  client.registry
	.registerDefaultTypes()
	.registerGroups([
    ['music', 'Music commands that use Commando'],
    ['misc', 'Misc commands that use Commando'],
    ['moderation', 'Moderation commands that use Commando'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
    help: false,
    ping: false,
    prefix: true,
    commandState: false,
    unknownCommand: false,
  })
	.registerCommandsIn(path.join(__dirname, 'cmds'));
  loadCommands(client)
 loadFeatures(client)

});

client.on('voiceStateUpdate', async (___, newState) => {
  if (
    newState.member.user.bot &&
    !newState.channelID &&
    newState.guild.musicData.songDispatcher &&
    newState.member.user.id == client.user.id
  ) {
    newState.guild.musicData.queue.length = 0;
    newState.guild.musicData.songDispatcher.end();
    return;
  }
  if (
    newState.member.user.bot &&
    newState.channelID &&
    newState.member.user.id == client.user.id &&
    !newState.selfDeaf
  ) {
    newState.setSelfDeaf(true);
  }
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
  const invite = new Discord.MessageEmbed()
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
          value: `[Invite me!](https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=2147483639&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D%5B750123677739122819%5D%26scope%3Dbot&scope=bot)`, // This is optional if you want over people to invite your bot to different servers!
          inline: true,
      },
  )
  .setFooter(`And a special thanks from the creator of ${client.user.username}`)
  channel.send(invite)
})

//heroku stack:set heroku-18 -a tubb-bot jic v509
client.login('NzUwMTIzNjc3NzM5MTIyODE5.X019HQ.USGz-7328iyyiA9UoGPTqZeU4xI')
client.login(process.env.token)

