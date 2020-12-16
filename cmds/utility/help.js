const { stripIndents } = require('common-tags');
const { util: { permissions } } = require('discord.js-commando');
module.exports = class Help2Command extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: [`h`, `commands`, `cmds`],
            group: 'utility',
            memberName: 'help',
            description: 'Describes all of this bot`s commands2',
            args: [
                {
                    key: 'command',
                    prompt: 'Which command would you like to view the help for?',
                    type: 'command',
                    default: ''
                }
            ]
        });
    }
    async run(message, { command }) {
        if (!command) {
            const embeds = [];
            for (let i = 0; i < Math.ceil(this.client.registry.groups.size / 10); i++) {
                const nsfw = message.channel.nsfw || this.client.isOwner(message.author);
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Command List (Page ${i + 1})`)
                    .setDescription(stripIndents`
						To run a command, use ${message.anyUsage('<command>')}.
						${nsfw ? '' : 'Use in an NSFW channel to see NSFW commands.'}
					`)
                    .setColor(0x00AE86);
                embeds.push(embed);
            }
            let cmdCount = 0;
            let i = 0;
            let embedIndex = 0;
            for (const group of this.client.registry.groups.values()) {
                i++;
                const owner = this.client.isOwner(message.author);
                const commands = group.commands.filter(cmd => {
                    if (owner) return true;
                    if (cmd.ownerOnly || cmd.hidden) return false;
                    if (cmd.nsfw && !message.channel.nsfw) return false;
                    return true;
                });
                if (!commands.size) continue;
                cmdCount += commands.size;
                if (i > (embedIndex * 10) + 10) embedIndex++;
                embeds[embedIndex].addField(`❯ ${group.name}`, commands.map(cmd => `\`${cmd.name}\``).join(' '));
            }
            const allShown = cmdCount === this.client.registry.commands.size;
            embeds[embeds.length - 1]
                .setFooter(`${this.client.registry.commands.size} Commands${allShown ? '' : ` (${cmdCount} Shown)`}`);
            try {
                const messages = [];
                for (const embed of embeds) messages.push(await message.say({ embed }));
            } catch {
                return message.reply('Failed to send help.');
            }
        } else {
            const userPerms = command.userPermissions
                ? command.userPermissions.map(perm => permissions[perm]).join(', ')
                : 'None';
            const clientPerms = command.clientPermissions
                ? command.clientPermissions.map(perm => permissions[perm]).join(', ')
                : 'None';
            return message.say(stripIndents`
			Command: **${command.name}** ${command.guildOnly ? ' (Usable only in servers)' : ''}
			${command.description}${command.details ? `\n${command.details}` : ''}
			**Aliases:** ${command.aliases.join(', ') || 'None'}
			**Permissions You Need:** ${userPerms}
			**Permissions I Need:** ${clientPerms}
        `);
        }
    }
};