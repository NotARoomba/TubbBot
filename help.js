command(client, 'help', message => {

    const helpEmbed = new Discord.MessageEmbed()
.setColor('#00FF00')
.setTitle(`Help`)
.setDescription(`This is the help command use -help to view it.

List of commands:

-help, what you're viewing right now

-ping, shows ping to Tubb

More commands in development!`)

message.reply(helpEmbed);
});