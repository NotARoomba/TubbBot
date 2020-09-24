require('module-alias/register');
require('events').EventEmitter.prototype._maxListeners = 100;
const Discord = require('discord.js')
const client = new Discord.Client()
const command = require('@util/command.js')
const mongo = require('@util/mongo');
const fs = require('fs');
const path = require('path');
const welcome = require('@features/welcome');
//const Commando = require('discord.js-commando');
const loadCommands = require('@root/commands/load-commands.js')
const commandBase = require('@root/commands/command-base.js')
const loadFeatures = require('@root/features/load-features.js')
const prefix = "-"
client.commands = new Discord.Collection();

//const client  = new Commando.CommandoClient({
 // owner: '465917394108547072'
//})
client.on('ready', async () => {
  console.log('Tubb is online!')
  client.user.setActivity('|-help|');

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

