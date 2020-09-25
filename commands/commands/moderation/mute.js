const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'mute',
    description: 'mummth muthm mheh',
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: (message) => {
        let user = message.mentions.users.first();
let role = message.guild.roles.find(r => r.name === 'Muted');
if(!role) message.guild.createRole({name: 'Muted'});
if(user.bot){
return message.channel.send(`I can't mute ${user} because he is a bot`);
}
if(user.hasPermission('ADMINISTRATOR')) {
return message.channel.send(`I can't mute ${user} because he is staff`);
}

if(!user){
    message.channel.send(`There's no person to mute tho`);
}
message.guild.channels.forEach(f => {
    f.overwritePermissions(role, {
        SEND_MESSAGES: false
    });
    user.addRole(role);
   
});
 message.channel.send(`I muted ${user}`);
}
}