module.exports = class PingCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'util',
            memberName: 'ping',
            description: 'Find your ping to me!',
        });
    }

    run(message) {

        webhookClient.send(`Command: ping 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
------------------------------------------------------------------------------------------- `)
        const waitEmbed = new Discord.MessageEmbed()
            .setColor('#C0C0C0')
            .setTitle(`Ping`)
            .setDescription(`:green_apple: Finding ping to bot... 
       
       :alarm_clock: Your ping is ${Date.now() - message.createdTimestamp} ms`)
        message.reply(waitEmbed).then((resultMessage) => {
        })
    }
}