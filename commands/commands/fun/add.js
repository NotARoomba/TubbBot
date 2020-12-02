module.exports = {
  commands: ['add', 'addition'],
  description: 'Add two numbers',
  callback: (message, args, text) => {
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: add 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
      let sum = 0
       for (const arg of args) {
        sum += parseInt(arg)
      }
  
      
    
    const addEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`The sum is ${sum}`)
    message.reply(addEmbed)
  }
}
