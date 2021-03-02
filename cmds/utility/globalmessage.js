module.exports = {
    name: 'globalmessage',
    group: 'utility',
    usage: `globalmessage (word)`,
    aliases: ['gm'],
    ownerOnly: true,
    description: 'Sends a message to all servers that Tubb is in.',
    async execute(message, toSay, client) {
        try {
            client.guilds.cache.map((guild) => {
                let found = 0
                guild.channels.cache.map((c) => {
                    if (found === 0) {
                        if (c.type === "text") {
                            if (c.permissionsFor(client.user).has("VIEW_CHANNEL") === true) {
                                if (c.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
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
    }
}