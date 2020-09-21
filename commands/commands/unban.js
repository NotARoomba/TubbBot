const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async (client, message, args) => {
        
        const member = message.mentions.member.first();
    
        if(!args[0]) return message.channel.send('Please specify a user');



        message.guild.members.unban(`${id}`)
        .catch(err => {
            if(err) return message.channel.send('Something went wrong')
        })

        const banembed = new Discord.MessageEmbed()
        .setTitle('Member Unbanned')
        .addField('User Unbanned', member)
        .addField('Unbanned by', message.author)

        message.channel.send(banembed);
    }
}