const Discord = require('discord.js');
var jimp = require('jimp');

const client = new Discord.Client();


module.exports = {
    commands: ['picture', 'pic'],
    description: '*click click*',
    callback: async (message) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_128_BLACK) 
        let welcome = await jimp.read('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v268batch2-kul-02_2.jpg?bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&q=80&usm=15&vib=3&w=1300&s=a5cfc956068e95f97f6df92d9d96439c').then(font => {
        welcome.print(font, 10, 10, 'Hello world!');
        await welcome.writeAsync(`welcome.png`);
        
    message.channel.send(``, { files: ["welcome.png"] })
      

}
)}


}
