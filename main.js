const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '-'

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
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if(!channel) return;

const welcomeEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Welcome`)
    .setDescription(`Welcome to Corona, ${member}! Once you join, you will be infected with the corona virus. There are 3 stages, diagnosed, recovering, and recovered. Once recovered you will be free just to hang out on this server and play, but until then, you have a hard battle. After you recovered, you will be vaccinated which will make sure you're never infected ever again. The way you level up and get through the virus is simply by just hanging out and "spreading" the word about this server! glhf and may the odds be ever in your favor.`)

channel.send(welcomeEmbed);

});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping'){
        client.commands.get('ping').execute(message, args);
    } 
    else if(command === 'help'){
        client.commands.get('help').execute(message, args);
    }
});

client.login(process.env.token);
