module.exports = class SetImageCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setimage',
      aliases: [`si`],
      memberName: 'setimage',
      group: 'config',
      description: `Set your server's custom welcome image`,
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'image',
          prompt:
            'Please give the image link',
          type: 'string'
        },
      ]
    });
  }
  async run(message, { image }) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    const { guild } = message
    const cache = {}
    cache[guild.id] = [image]
    await serverSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        image,
      },
      {
        upsert: true,
      }
    )

    webhookClient.send('UPDATED IMAGE DATABASE')

    message.reply('Welcome image set! Please make sure that it is the proper link for your image.')
  } catch(error) {
    console.error(error);
    return message.reply(error.message).catch(console.error);
  }
}

