module.exports = class SetColorCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setcolor',
      aliases: [`sc`],
      memberName: 'setcolor',
      group: 'config',
      description: `Set your server's custom welcome image color`,
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'color',
          prompt:
            'Please give the hex code for your welcome image',
          type: 'string'
        },
      ]
    });
  }
  async run(message, { color }) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    const { guild } = message
    const cache = {}
    cache[guild.id] = [color]
    await serverSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        color,
      },
      {
        upsert: true,
      }
    )

    webhookClient.send('UPDATED IMAGE DATABASE')
    message.reply('Server color set! Please make sure that it is a hex code.')
  } catch(error) {
    console.error(error);
    return message.reply(error.message).catch(console.error);
  }
}

