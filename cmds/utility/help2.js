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
        fs.readdir("./cmds", (error, folders) => {

            folders.forEach(folder => {
                fs.readdir(`./cmds/${folder}/`, (error, possibleCommands) => {
     
                   let jsCommands = possibleCommands.filter(pcmd => pcmd.split(".").pop() === "js");
                   if (jsCommands.length <= 0) {
                         console.log(`No commands to load in ${folder}!`);
                         return;
                   }
     
                   jsCommands.forEach(command => {
                        let props = require(`../${folder}/${command}`);
                        let name = props.name.replace("Command", "").toLowerCase();
                        const description = props.description;
                        console.log(`Name: ${name}, description: ${description}.`); //Name: undefined, description: undefined.
                   });
                })
            });
        });
        // const commandEmbed = new Pagination.FieldsEmbed()
        //     .setArray(command)
        //     .setAuthorizedUsers([message.author.id])
        //     .setChannel(message.channel)
        //     .setElementsPerPage(10)
        //     .formatField('# - Command', function (e) {
        //         return `**${command.indexOf(e) + 1}**: ${e.name}`;
        //     });

        // commandEmbed.embed.setColor('#ff7373').setTitle('Help');
        // commandEmbed.build();

    }
}
