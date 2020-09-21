const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: (message, args) => {

        if (!isNaN(args[0])) {
            const bannedMember = message.guild.members.cache.get(args[0]) // Get the `member` property instead to recall later.
            var reason = args.slice(1).join(" ");
            if(!reason) {
              reason = "No reason given!"
            }
            if (bannedMember) {
              bannedMember
                message.guild.members.unban(bannedMember.id, reason)
                .then(() => {
                  message.channel.send(`Successfully unbanned **${bannedMember.user.tag}**`);
                })
                .catch(err => {
                  message.channel.send('I was unable to unban the member');
                  console.error(err);
                });
            } else {
              message.channel.send("That user isn't in this guild!");
            }
          } else {
            message.channel.send("You need to provide an user ID to unban");
          }
    }
}