const { CommandoRegistry } = require("discord.js-commando");

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
        const commands = Commando.commands
        console.log(commands)

        console.log(command)
        const commandEmbed = new Pagination.FieldsEmbed()
            .setArray(command)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(10)
            .formatField('# - Command', function (e) {
                return `**${command.indexOf(e) + 1}**: ${e.name}`;
            });

        commandEmbed.embed.setColor('#ff7373').setTitle('Help');
        commandEmbed.build();


    }
}
