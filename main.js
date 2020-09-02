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
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

client.on('guildMemberAdd', member => {
        member.guild.channels.get('channelID').send("Welcome"); 
    });

})


const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping'){
        client.commands.get('ping').execute(message, args);
    } 
});

client.login(process.env.token);
