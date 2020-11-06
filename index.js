require('module-alias/register');
require('events').EventEmitter.prototype._maxListeners = 100;
const Discord = require('discord.js')
const client = new Discord.Client
const mongo = require('@util/mongo');
const loadCommands = require('@root/commands/load-commands.js')
const loadFeatures = require('@root/features/load-features.js')
const ytdl = require("ytdl-core");
client.queue = new Map();
const prefix = "-"




client.on('ready',  async () => {
  console.log('Tubb is online!')
  client.user.setPresence({
    status: 'online',
   activity: {
        name: ` -help in ${client.guilds.cache.size} servers | Made by L061571C5`,
        type: 'WATCHING',
   }
})

  

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


//heroku stack:set heroku-18 -a tubb-bot jic v509
client.login('NzUwMTIzNjc3NzM5MTIyODE5.X019HQ.m8ieoPXK1T5f5xJaH0e1K8N3wII')
client.login(process.env.token)

