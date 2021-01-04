const MojangAPI = require("mojang-api");
module.exports = class MinecraftCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'minecraft',
            aliases: ['mc'],
            group: 'fun',
            memberName: 'minecraft',
            description: 'Connect to the Minecraft API and display information.',
            args: [
                {
                    key: 'query',
                    prompt: 'What is the account name of the user you would like to search for?',
                    type: 'string'
                },

            ]
        });
    }


    async run(message, { query }) {
        var str = query
        MojangAPI.nameToUuid(str, function (err, res) {
            if (err) return message.reply("there was an error trying to convert the username into UUID!");
            else if (!res[0]) return message.channel.send("No player named **" + str + "** were found")
            MojangAPI.profile(res[0].id, function (err, res) {
                if (err) message.reply("there was an error trying to fetch the user's profile!");
                else {
                    let skin = "https://visage.surgeplay.com/full/256/" + res.id;
                    const Embed = new Discord.MessageEmbed()
                        .setColor('#00000')
                        .setTitle(res.name)
                        .setDescription("Profile:")
                        .addField("UUID", res.id, true)
                        .addField("Username", res.name, true)
                        .setImage(skin)
                        .setTimestamp()
                        .setFooter("Powered by Mojang Api", message.client.user.displayAvatarURL());
                    message.channel.send(Embed);
                }
            });
        });

    }
}
