
module.exports = class MuteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      group: 'moderation',
      memberName: 'mute',
      userPermissions: ['MUTE_MEMBERS'],
      description: 'Mutes a user',
      guildOnly: true,
      args: [
        {
          key: 'target',
          prompt: 'Who to mute',
          type: 'user'
        },
        {
          key: 'time',
          prompt: 'When do you want them to be unmuted?',
          type: 'integer'
        },
        {
          key: 'reason',
          prompt: 'Why do you want to mute them?',
          type: 'string'
        },
      ],
    })
  }

  run = async (message, { target, reason, time }) => {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    // !mute @ reason

    const { guild, author: staff } = message

    const previousMutes = await muteSchema.find({
      userId: target.id,
    })

    const currentlyMuted = previousMutes.filter((mute) => {
      return mute.current === true
    })

    if (currentlyMuted.length) {
      message.reply('That user is already muted')
      return
    }

    let duration = time

    const expires = new Date()
    expires.setHours(expires.getHours() + duration)

    const mutedRole = guild.roles.cache.find((role) => {
      return role.name === 'Muted'
    })
    if (!mutedRole) {
      message.reply('Could not find a "Muted" role')
      return
    }

    const targetMember = (await guild.members.fetch()).get(target.id)
    targetMember.roles.add(mutedRole)

    await new muteSchema({
      userId: target.id,
      guildId: guild.id,
      reason,
      staffId: staff.id,
      staffTag: staff.tag,
      expires,
      current: true,
    }).save()

    message.reply(
      `You muted <@${target.id}> for "${reason}". They will be unmuted in ${duration} hours.`
    )
  }
}