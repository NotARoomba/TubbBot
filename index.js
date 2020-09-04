const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./command.js')
const economy = require('./economy')
const mongo = require('./mongo')
const path = require('path')
const fs = require('fs');
const { callback } = require('./commands/economy/balance')

const prefix = "-"
client.commands = new Discord.Collection();


 
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
  console.log('Tubb is online!')
  client.user.setActivity('|-help|');
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
 
    if(command === 'ping'){
        client.commands.callback('ping')
    } 
});


client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if(!channel) return;

const welcomeEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Welcome`)
    .setDescription(`Welcome to Corona, ${member}! Once you join, you will be infected with the corona virus. There are 3 stages, diagnosed, recovering, and recovered. Once recovered you will be free just to hang out on this server and play, but until then, you have a hard battle. After you recovered, you will be vaccinated which will make sure you're never infected ever again. The way you level up and get through the virus is simply by just hanging out and "spreading" the word about this server! Goodluck and may the odds be ever in your favor.`)

channel.send(welcomeEmbed);

});

command(client, 'ping', message => {

    const waitEmbed = new Discord.MessageEmbed()
    .setColor('#C0C0C0')
    .setTitle(`Ping`)
    .setDescription(`:green_apple: Finding ping to bot...
   
   :alarm_clock: Your ping is ${Date.now() - message.createdTimestamp} ms`)
    message.reply(waitEmbed).then((resultMessage) => {
    })
});

    
command(client, 'help', message => {

        const helpEmbed = new Discord.MessageEmbed()
    .setColor('#00FF00')
    .setTitle(`Help`)
    .setDescription(`This is the help command use -help to view it.
    
    List of commands:
    
    -help, what you're viewing right now
    
    -ping, shows ping to Tubb
    
    More commands in development!`)

    message.reply(helpEmbed);
});

command(client, 'bal', message => {
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildId = message.guild.id
    const userId = target.id

    const coins = economy.getCoins(guildId, userId)

    message.reply(`That user has ${coins} coins!`)
  }),



//client.login('NzUwMTIzNjc3NzM5MTIyODE5.X019HQ.1_2Ti4y-h9PJljBHzotdA36p7vY')
client.login(process.env.token);
