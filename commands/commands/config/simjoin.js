module.exports = {
    commands: ['simjoin', 'sj'],
    requiredPermissions: 'ADMINISTRATOR',
    callback: (message, args, text, client) => {
      const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        webhookClient.send(`Command: simjoin 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
      client.emit('guildMemberAdd', message.member)
    },
  }