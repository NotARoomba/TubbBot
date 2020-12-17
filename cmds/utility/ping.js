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

        client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
        const waitEmbed = new Discord.MessageEmbed()
            .setColor('#ffc018')
            .setTitle(`Ping`)
            .setDescription(`:green_apple: Finding ping to bot... 
       
       :alarm_clock: Your ping is ${Date.now() - message.createdTimestamp} ms`)
        message.reply(waitEmbed).then((resultMessage) => {
        })
    }
}