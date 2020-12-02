module.exports = {
    commands: 'summon',
    maxArgs: 1,
    description: '*Holy Music stops*',
    expectedArgs: "[Target user's @]",
    callback: (message) => {
        const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: summon 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
        const target = message.mentions.users.first()

      
      const balusrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription('Please tag a user to Summon.')
            if (!target) {
      
      message.say(balusrEmbed)
                return
            }

        const summonEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setTitle(`Ritual of Summon`)
        .setDescription(`${target}`)
        

    message.say(summonEmbed)  

    const summoningEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setDescription(`${target}`)
        

    message.say(summoningEmbed)
    message.say(summoningEmbed)
    message.say(summoningEmbed)
    message.say(summoningEmbed) 
    }
}