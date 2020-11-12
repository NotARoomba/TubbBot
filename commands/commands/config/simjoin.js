module.exports = {
    commands: ['simjoin', 'sj'],
    permissionError: 'You must be an admin to run this command.',
    requiredPermissions: ['ADMINISTRATOR'],
    callback: (message, args, text, client) => {
      client.emit('guildMemberAdd', message.member)
    },
  }