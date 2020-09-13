
module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    
      const target = mentions.users.first()
      if (target) {
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.ban()
        message.channel.send(`${tag} That user has been banned`)
      } else {
        message.channel.send(`${tag} Please specify someone to ban.`)
      }
    
  }
}
