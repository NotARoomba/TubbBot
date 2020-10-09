const client = new Discord.Client();
const Discord = require('discord.js');
var jimp = require('jimp');

module.exports = {
    commands: ['picture', 'pic'],
    minArgs: 0,
    maxArgs: 0,
    description: '*click click*',
    callback: async (message, arguments, text) => {
        async function resize() {
        let welcome = await jimp.read('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v268batch2-kul-02_2.jpg?bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&q=80&usm=15&vib=3&w=1300&s=a5cfc956068e95f97f6df92d9d96439c').then(font => {
        await image.resize(700, 300);
        await image.writeAsync(`welcome.png`);
        
    message.channel.send(``, { files: ["welcome.png"] })
      

}
)}

}
}
