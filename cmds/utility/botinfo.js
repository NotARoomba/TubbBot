const { version: djsVersion } = require('discord.js');
const { version: commandoVersion } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
const { formatNumber, embedURL } = require('@util/util');
const { version, dependencies } = require('@root/package');
const permissions = ['ADMINISTRATOR']
const deps = { ...dependencies };
const source = 'TubbBot' && 'L061571C5';


module.exports = class InfoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'info',
      aliases: ['stats', 'uptime', 'bot-info', 'sys'],
      group: 'util',
      memberName: 'info',
      description: 'Responds with detailed bot information.',
      guarded: true,
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async run(msg) {
    const invite = await this.client.generateInvite({ permissions });
    const repoURL = `https://github.com/L061571C5/TubbBot`;
    const embed = new Discord.MessageEmbed()
      .setColor(0x00AE86)
      .addField('❯ Servers', formatNumber(this.client.guilds.cache.size), true)
      .addField('❯ Commands', formatNumber(this.client.registry.commands.size), true)
      .addField('❯ Shards', formatNumber(this.client.options.shardCount), true)
      .addField('❯ Home Server',
        this.client.options.invite ? embedURL('Invite', this.client.options.invite) : 'None', true)
      .addField('❯ Invite', embedURL('Add Me', invite), true)
      .addField('❯ Source Code', source ? embedURL('GitHub', repoURL) : 'N/A', true)
      .addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
      .addField('❯ Uptime', moment.duration(this.client.uptime).format('d:hh:mm:ss'), true)
      .addField('❯ Version', `v${version}`, true)
      .addField('❯ Node.js', process.version, true)
      .addField('❯ Discord.js', `v${djsVersion}`, true)
      .addField('❯ Commando', `v${commandoVersion}`, true)
      .addField('❯ Dependencies', Object.keys(deps).sort().join(', '));
    return msg.embed(embed);
  }
};