const Discord = require('discord.js');
var jimp = require('jimp');

const client = new Discord.Client();


module.exports = {
    commands: ['picture', 'pic'],
    description: '*click click*',
    callback: async (message, args) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_128_BLACK) 
        let welcome = await jimp.read('https://cdn.discordapp.com/attachments/757768055479861278/758090856325709885/bh.jpeg').then(font => {
        welcome.print(font, 10, 10, 'Hello world!');
        welcome.write('Welcome2.png')
        
    message.channel.send(``, { files: ["Welcome2.png"] })
      

}
)}


}
