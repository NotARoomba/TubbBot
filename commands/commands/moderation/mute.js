const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'mute',
    description: 'munmth muthm mheh',
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: (message) => {
        let user = message.mentions.users.first();
let role = message.guild.roles.cache.find(r => r.name === 'Muted');
if(!role) message.guild.createRole({name: 'Muted'});

if(!user){
    message.channel.send(`There's no person to mute tho`);
}
message.guild.channels.cache.forEach(f => {
    f.overwritePermissions(role, {
        SEND_MESSAGES: false
    });
    user.addRole(role);
   
});
 message.channel.send(`I muted ${user}`);
}
}