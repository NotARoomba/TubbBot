module.exports = {
    commands: ['simjoin', 'sj'],
    requiredPermissions: 'ADMINISTRATOR',
    callback: (message, args, text, client) => {
      const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: simjoin 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
      client.emit('guildMemberAdd', message.member)
    },
  }