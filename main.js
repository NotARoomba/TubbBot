const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '*'

const fs = require('fs');
const { execute } = require('./commands/ping');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready' , () => {
    console.log('Tubb is online!');
})

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(channel => channel.name === "general");
    if(!channel) return;

    channel.send(`Welcome to Corona ${member}`)
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping'){
        client.commands.get('ping').execute(message, args);
    } 
});

client.login(process.env.token);
