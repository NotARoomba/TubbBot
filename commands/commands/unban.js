const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: (message, args) => {

        var command = message.content.toLowerCase().split(" ")[0];
    var args = message.content.toLowerCase().split(" ");
    var user = message.mentions.users.first()
   {
        
       
        if(!args[1]) return  message.channel.send('Mention User Or Type ID');
        if(args[1].length < 16) return message.reply('This ID is not id user!');
        message.guild.fetchBans().then(bans => {
            var Found = bans.find(m => m.id === args[1]);
            if(!Found) return message.channel.send(`I Can't Find <@${args[1]}> In The Ban List`);
            message.guild.unban(args[1]);
            message.channel.send(`<@${args[1]}> Unbanned!`);
            }

        )}
        }
    }
