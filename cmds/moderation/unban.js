module.exports = class UnbanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            memberName: 'unban',
            group: 'moderation',
            description: 'Reinstatement to this Server!',
            guildOnly: true,
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
            args: [
                {
                    key: 'member',
                    prompt:
                        'Please give the id of the user that you want to unban',
                    type: 'string'
                },
            ]
        });
    }
    async run(message, { member }) {

        client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
        message.guild.fetchBans().then(bans => {
            message.guild.members.unban(member)
        })

        const ubyesEmbed = new Discord.MessageEmbed()
            .setColor('#228B22')
            .setTitle(`Success`)
            .setDescription(`${member} has been unbanned`)

        await message.channel.send(ubyesEmbed)

    }
}

