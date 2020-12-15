const { CommandoRegistry } = require("discord.js-commando");
const { stripIndents } = require('common-tags');

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
        const commands = this.client.registry.findCommands('', false);

        var arr = commands
        let name = commands[0].group

        console.log(arr, name)


        const commandEmbed = new Pagination.FieldsEmbed()
            .setArray(arr)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(10)
            .formatField('# - Command', function (e) {
                return `** ${commands.description} **: ${commands.name}`;
            });

        commandEmbed.embed.setColor('#ff7373').setTitle('Help');
        commandEmbed.build()




    }
}


