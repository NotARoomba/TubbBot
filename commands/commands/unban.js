const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: (message) => {
        
        let User = args[0];
        let Reason = args.slice(1).join(` `);
        if (!User) return message.reply(`Who are we unbanning?`);
        if (!Reason) Reason = `Unbanned by ${message.author.tag}`
        
        message.guild.fetchBans()
        .then(bans => {
        if (bans.some(u => User.includes(u.username))) {
        let user = bans.find(user => user.username === User);
        
        message.guild.unban(user.id, Reason);
        }
        else if (bans.some(u => User.includes(u.id))) {
        
        message.guild.unban(User, Reason);
        }
        else {
        return message.reply(`This person is not banned`);
        }
        });
    }
}