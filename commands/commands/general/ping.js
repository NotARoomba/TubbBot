module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    description: 'Find your ping to me!',
    callback: (message, arguments, text) => {
        const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ping 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
        const waitEmbed = new Discord.MessageEmbed()
        .setColor('#C0C0C0')
        .setTitle(`Ping`)
        .setDescription(`:green_apple: Finding ping to bot... 
       
       :alarm_clock: Your ping is ${Date.now() - message.createdTimestamp} ms`)
        message.reply(waitEmbed).then((resultMessage) => {
        })
    },
}