module.exports = class SetWelcomeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setwelcome',
      aliases: [`sw`],
      memberName: 'setwelcome',
      group: 'config',
      description: `Set your server's custom welcome channel and message`,
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'text',
          prompt:
            'Please give the welcome message',
          type: 'string'
        },
      ]
    });
  }
  async run(message, { text }) {

    webhookClient.send(`Command: setwelcome 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
    const { guild, channel } = message
    const cache = {}
    cache[guild.id] = [channel.id, text]

    await serverSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        channelId: channel.id,
        text,
      },
      {
        upsert: true,
      }
    )
    webhookClient.send('UPDATED DATABASE')
    channel.reply('Welcome message and channel set!')
  }
}

