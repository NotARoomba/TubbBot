const Discord = require('discord.js');

const client = new Discord.Client();

module.exports = {
    name: 'help',
    description: "this is the help command!",
    execute(message, args){

        const helpEmbed = new Discord.MessageEmbed()
    .setColor('#8B0000')
    .setTitle(`Help`)
    .setDescription(`This is the help command use -help to view it.`)

    message.reply(helpEmbed);



    }
};
