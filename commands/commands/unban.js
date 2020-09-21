const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'unban',
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: async (message) => {
        const { member, mentions, arguments} = message

        const tag = `<@${member.id}>`
        let unbanned = message.mentions.users.first() || client.users.resolve(args[0]);
        let reason = args.slice(1).join(" ");
        let member = await client.users.fetch(unbanned);
        let ban = await message.guild.fetchBans();
        
        const target = mentions.users.first()
      if (target) {
        var user = ban.get(member.id);
    message.guild.members.unban(member);

        const unbyesEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`${tag} That user has been unbanned`)


        message.channel.send(unbyesEmbed)
      } else {
        
        const unberrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`${tag} Please specify someone to unban.`)
        
        message.channel.send(unberrEmbed)
      }
    }
}