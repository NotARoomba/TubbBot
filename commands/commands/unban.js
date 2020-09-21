const Discord = require('discord.js')

 module.exports = {
    commands: 'unban',
    description: 'Reinstatement to this Server!',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {

        const member = args[0];

        if (!member) {
             
            const iderrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`Please enter a id!`)

            return message.channel.send(iderrEmbed)
        }

        try {
            message.guild.fetchBans().then(bans => {
                message.guild.members.unban(member)
            })
            
            const ubyesEmbed = new Discord.MessageEmbed()
             .setColor('#228B22')
             .setTitle(`Success`)
             .setDescription(`${member} has been unbanned!`)

            await message.channel.send(ubyesEmbed)
        } catch (e) {
            
            const uberrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription(`An error occured!`)
            
            return message.channel.send(uberrEmbed)
        }

    }
}
