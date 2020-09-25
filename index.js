require('module-alias/register');
require('events').EventEmitter.prototype._maxListeners = 100;
const Discord = require('discord.js')
const mongo = require('@util/mongo');
const Commando = require('discord.js-commando');
const loadCommands = require('@root/commands/load-commands.js')
const loadFeatures = require('@root/features/load-features.js')
const path = require('path')

const client  = new Commando.CommandoClient({
  owner: '465917394108547072'
})
client.on('ready', async () => {
  console.log('Tubb is online!')
  client.user.setActivity('|-help|');

  client.registry
    .registerGroups([
      ['misc', 'misc commands'],
      ['moderation', 'moderation commands'],
      ['games', 'Commands to handle games'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'cmds'))


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

