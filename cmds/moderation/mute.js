
module.exports = class MuteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      group: 'moderation',
      memberName: 'mute',
      userPermissions: ['MUTE_MEMBERS'],
      description: 'Mutes a user',
      args: [
        {
          key: 'target',
          prompt: 'Who to mute',
          type: 'user'
      },
        {
          key: 'reason',
          prompt: 'Why do you want to mute them?',
          type: 'string'
      },
        {
            key: 'time',
            prompt: 'When do you want them to be unmuted?',
            type: 'string'
        },
    ],
    })
  }

  run = async (message, { target, reason, time }) => {
    const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
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