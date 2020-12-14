module.exports = class UnmuteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      group: 'moderation',
      memberName: 'unmute',
      userPermissions: ['MUTE_MEMBERS'],
      description: 'Unmutes a user',
      argsType: 'multiple',
    })
  }

  run = async (message, args) => {

    webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
    //!unmute @
    //!unmute ID

    const { guild } = message

    if (args.length !== 1) {
      message.reply(
        `Please use the correct syntax: ${guild.commandPrefix}mute <Target user\'s @ OR their ID>`
      )
      return
    }

    let id = ''

    const target = message.mentions.users.first()
    if (target) {
      id = target.id
    } else {
      id = args[0]
    }

    const result = await muteSchema.updateOne(
      {
        guildId: guild.id,
        userId: id,
        current: true,
      },
      {
        current: false,
      }
    )

    if (result.nModified === 1) {
      const mutedRole = guild.roles.cache.find((role) => {
        return role.name === 'Muted'
      })

      if (mutedRole) {
        const guildMember = guild.members.cache.get(id)
        guildMember.roles.remove(mutedRole)
      }

      message.reply(`You unmuted <@${id}>`)
    } else {
      message.reply('That user is not muted')
    }
  }
}