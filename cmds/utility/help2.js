const paginationEmbed = require('discord.js-pagination');
module.exports = class Help2Command extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'help2',
            aliases: [`h2`, `commands2`, `cmds2`],
            group: 'utility',
            memberName: 'help2',
            description: 'Describes all of this bot`s commands2',
        });
    }
    async run(message) {
        let config = new Discord.MessageEmbed()
        .setColor("#a442f4")
        .setAuthor("Tubb", message.client.user.displayAvatarURL());
        config = config.addField("\u200B", "**" + group.name + "**");
        const group = this.client.registry.groups.findGroup('config', true)
        console.log(group)
			group.commands.forEach((cmd) => {
				config = config.addField(
					cmdPrefix +
						cmd.name +
						(cmd.aliases ? " (" + cmd.aliases.join(", ") + ")" : "") +
						(cmd.nsfw ? " NSFW" : ""),
					cmd.description
				)
			})
		
        pages = [
            config,
            moderation,
            fun,
            utility,
            config,
        ];
        paginationEmbed(message, pages, emojiList, timeout);
}
};