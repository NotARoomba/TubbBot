require(module-alias/register);
const Discord = require('discord.js')
const client = new Discord.Client()
const command = require('@util/command.js')
const mongo = require('./mongo');
const fs = require('fs');
//const Commando = require('discord.js-commando');
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

  const baseFile = 'command-base.js'
  const commandBase = require(`./commands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(client, option)
      }
    }
  }

  readCommands('commands')

});




client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if(!channel) return;

const welcomeEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Welcome`)
    .setDescription(`Welcome to Corona, ${member}! Once you join, you will be infected with the corona virus. There are 3 stages, diagnosed, recovering, and recovered. Once recovered you will be free just to hang out on this server and play, but until then, you have a hard battle. After you recovered, you will be vaccinated which will make sure you're never infected ever again. The way you level up and get through the virus is simply by just hanging out and "spreading" the word about this server! Please read #rules and #roles. Goodluck and may the odds be ever in your favor.(Btw -help)`)

channel.send(welcomeEmbed);

});



    






//client.login('NzUwMTIzNjc3NzM5MTIyODE5.X019HQ.1_2Ti4y-h9PJljBHzotdA36p7vY')
client.login(process.env.token);
