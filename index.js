require('module-alias/register');
require('events').EventEmitter.prototype._maxListeners = 200;
require('dotenv').config();
const  { Structures } = require('discord.js');
const { MongoClient } = require('mongodb')
global.MongoDBProvider = require('commando-provider-mongo')
global.Commando = require('discord.js-commando')
//const client = new Discord.Client
global.mongo = require('@util/mongo');
global.loadCommands = require('@root/commands/load-commands.js')
global.loadFeatures = require('@root/features/load-features.js')
global.Discord = require('discord.js')
global.path = require('path');
global.MessageEmbed
global.Structures
global.ytdl = require('ytdl-core');
global.Youtube = require('simple-youtube-api');
global.cheerio = require('cheerio');
global.fetch = require('node-fetch');
global.Pagination = require('discord-paginationembed');
global.db = require('quick.db');
global.translate = require('@vitalets/google-translate-api');
global.request = require('node-superfetch')
global.commandBase = require('@root/commands/command-base')
global.serverSchema = require('@schemas/server-schema')
global.muteSchema = require('@schemas/mute-schema')
global.Canvas = require('canvas')
global.math = require('mathjs');
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
  commandPrefix: `-`,
  invite: `https://discord.gg/C8HM2hkTqt`

})
client.setProvider(
  MongoClient.connect('mongodb+srv://L061571C5:89euzXX8IylP1DYn@tubbbot.kfqqn.mongodb.net/data?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
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
    ['utility', 'Utility commands that use Commando'],
    ['moderation', 'Moderation commands that use Commando'],
    ['fun', 'Fun commands that use Commando'],
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
  message.reply(`Use ${message.guild.commandPrefix}help for a list of commands!`);
};
})
client.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  const invite = {
  title: `Thank you for inviting me to \`\`${guild.name}\`\`!`,
  fields: [
      {
          name: `My default prefix is`,
          value: `\`\`-\`\` but you can always change it by running \n-setprefix`,
          inline: true,
      },
      {
          name: `My commands`,
          value: `Run -help or -commands to show all of my commands!`,
          inline: true,
      },
      {
          name: `If you want to invite me to your server please click Invite me!`,
          value: `[Invite me!](https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D%5B750123677739122819%5D%26scope%3Dbot&scope=bot)`, // This is optional if you want over people to invite your bot to different servers!
          inline: true,
      },
      {
        name: `My server if you have any questions`,
        value: `[Link](https://discord.gg/C8HM2hkTqt)`, // This is optional if you want over people to invite your bot to different servers!
        inline: true,
    },
    ],
    timestamp: new Date(),
  footer: {
    text: `Thank you from the creator of ${client.user.username}`}
  }
  channel.send({ embed: invite })
})
client.login(DISCORD_TOKEN)