const MojangAPI = require("mojang-api");
const Discord = require('discord.js');
module.exports = {
    name: 'minecraft',
    subcommands: 'pro/profile, server/srv, history/his',
    aliases: 'mc',
    description: 'Connect to the Minecraft API and display information.',
    async execute(message, args) {
        if (!args) return message.reply(`usage: <profile/server/history> <profile name/server ip/ profile name>. Check -help minecraft for more info.`)
        args = args.split(" ")
        let str;
        if (args[0] === "profile" || args[0] === "pro") {
            if (args[1]) str = args[1];
            if (str.length <= 16) MojangAPI.nameToUuid(str, function (err, res) {
                if (err) return message.reply("there was an error trying to convert the username into UUID!");
                else if (!res[0]) return message.channel.send("No player named **" + str + "** were found")
                MojangAPI.profile(res[0].id, function (err, res) {
                    if (err) message.reply("there was an error trying to fetch the user's profile!");
                    else {
                        let skin = "https://visage.surgeplay.com/full/256/" + res.id;
                        const Embed = new Discord.MessageEmbed()
                            .setColor('#000000')
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
            else
                MojangAPI.profile(str, function (err, res) {
                    if (err) message.reply("there was an error trying to fetch the user's profile!");
                    else {
                        let skin = "https://visage.surgeplay.com/full/256/" + res.id;

                        const Embed = new Discord.MessageEmbed()
                            .setColor('#000000')
                            .setTitle(res.name)
                            .setDescription("Profile:")
                            .addField("UUID", res.id, true)
                            .addField("Username", res.name, true)
                            .setImage(skin)
                            .setTimestamp()
                            .setFooter(
                                "Powered by Mojang Api",
                                message.client.user.displayAvatarURL()
                            );
                        message.channel.send(Embed);
                    }
                });
        } else if (args[0] === "server" || args[0] === "srv") {
            const url = `https://api.mcsrvstat.us/2/${args[1]}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Received HTTP Status Code " + res.status);
            const body = await res.json();
            if (body.online) {
                const ip = body.ip;
                const port = body.port;
                const player = body.players.online + " / " + body.players.max;
                const version = body.version;
                const hostname = body.hostname;
                const desc = body.motd.clean.join("\n");
                const spaceRemoved = desc.replace(/ +(?= )/g, '');
                const Embed = new Discord.MessageEmbed()
                    .setTitle(args[1])
                    .setColor('#000000')
                    .addField("IP", "`" + ip + "`", true)
                    .addField("Port", "`" + port + "`", true)
                    .addField("Player/Max", "`" + player + "`", true)
                    .addField("Version", "`" + version + "`", true)
                    .addField("Hostname", "`" + hostname + "`", true)
                    .addField("Description", "`" + spaceRemoved + "`")
                    .setTimestamp()
                    .setFooter("Powered by Mojang Api", message.client.user.displayAvatarURL());
                return message.channel.send(Embed);
            } else {
                return message.channel.send("The server - **" + args[1] + "** - is offline/under maintenance.")
            }
        } else if (args[0] === "history" || args[0] === "his") {
            MojangAPI.nameToUuid(args[0], function (err, res) {
                if (err) return message.reply("there was an error trying to convert the username into UUID!");
                else if (!res[0]) return message.channel.send("No player named **" + args[1] + "** were found");
                MojangAPI.nameHistory(res[0].id, function (err, result) {
                    if (err) return message.reply("there was an error trying to fetch the username history!");
                    else {
                        var names = [];
                        var num = 0
                        for (var i = result.length - 1; i > -1; i--) {
                            ++num;
                            if (num === 1) names.push("**" + num + ". " + result[i].name + "**");
                            else names.push(num + ". " + result[i].name);
                        }
                        const Embed = new Discord.MessageEmbed()
                            .setColor('#000000')
                            .setTitle(res[0].name + "'s Username History")
                            .setDescription(names.join("\n"))
                            .setFooter("Last changed on " + new Date(result[result.length - 1].changedToAt), message.client.user.displayAvatarURL());
                        message.channel.send(Embed);
                    }
                });
            });
        }
    }
}