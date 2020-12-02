const Discord = require('discord.js')
const config = require('@root/config.json');
 module.exports = {
    commands: 'unban',
    maxArgs: 1,
    expectedArgs: "<Target user's Id>",
    description: 'Reinstatement to this Server!',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {
        const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: unban 
        Ran by: ${message.author.tag}
        Server: ${message.guild.name}
        Date: ${new Date()}`)

        const member = args[0];

        if (!member) {
             
            const iderrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`Please enter a id`)

            return message.channel.send(iderrEmbed)
        }

        try {
            message.guild.fetchBans().then(bans => {
                message.guild.members.unban(member)
            })
            
            const ubyesEmbed = new Discord.MessageEmbed()
             .setColor('#228B22')
             .setTitle(`Success`)
             .setDescription(`${member} has been unbanned`)

            await message.channel.send(ubyesEmbed)
        } catch (e) {
            
            const uberrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`An error occured`)
            
            return message.channel.send(uberrEmbed)
        }

    }
}
