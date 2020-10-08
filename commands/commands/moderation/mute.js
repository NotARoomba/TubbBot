const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'mute',
    description: 'Muhn mhuuthm mhee',
    maxArgs: 1,
    expectedArgs: "<Target user's @>",
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: (message) => {
        const role = message.guild.roles.cache.find(r => r.name === "Muted");
        const { member, mentions, arguments} = message

        const tag = `<@${member.id}>`
        
        const target = mentions.users.first()
        
if (target) {
    const targetMember = message.guild.members.cache.get(target.id)
    targetMember.roles.add(role);
    const mutyesEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`${tag} That user has been muted`)


        message.channel.send(mutyesEmbed)
} else {

    const muterrEmbed = new Discord.MessageEmbed()
    .setColor('#FFFF00')
    .setTitle(`Error`)
    .setDescription(`${tag} Please specify someone to mute`)

message.channel.send(muterrEmbed)

}
    }
}