module.exports = class GlobalMessageCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'globalmessage',
      aliases: ['gm'],
      group: 'util',
      memberName: 'globalmessage',
      description: 'Sends a message to all servers',
      ownerOnly: true,
      args: [
        {
          key: 'query',
          prompt: 'What do you want to say?',
          type: 'string',
        }
      ]
    })
  }
  async run(message, { query }) {
    if (message.author.id === "465917394108547072") {
      try {
        let toSay = query
        this.client.guilds.cache.map((guild) => {
          let found = 0
          guild.channels.cache.map((c) => {
            if (found === 0) {
              if (c.type === "text") {
                if (c.permissionsFor(this.client.user).has("VIEW_CHANNEL") === true) {
                  if (c.permissionsFor(this.client.user).has("SEND_MESSAGES") === true) {
                    c.send(toSay);
                    found = 1;
                  }
                }
              }
            }
          });
        });
      }
      catch (err) {
        console.log(err);
      }
    } else {
      message.reply("You cant do that!")
    }
  }
}