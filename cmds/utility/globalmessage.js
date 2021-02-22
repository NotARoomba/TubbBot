const Discord = require('discord.js');
module.exports = {
    name: 'globalmessage',
    group: 'utility',
    usage: `globalmessage (word)`,
    aliases: ['gm'],
    description: 'Sends a message to all servers that Tubb is in.',
    async execute(message, toSay) {
        if (message.author.id === "465917394108547072") {
            try {
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