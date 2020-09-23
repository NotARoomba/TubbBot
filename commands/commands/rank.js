const Discord = require('discord.js');
var jimp = require('jimp');

const client = new Discord.Client();


module.exports = {
    commands: 'rank',
    description: 'I wanna be the very best...',
    callback: async (message, args) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK) 
        let welcome = await jimp.read('https://cdn.discordapp.com/attachments/757768055479861278/758090856325709885/bh.jpeg')
        welcome.print(font, 508, 200, `Hello, ${message.author.tag}`) 
        welcome.write('Welcome2.png')
        
    message.channel.send(``, { files: ["Welcome2.png"] })
      

    }

};