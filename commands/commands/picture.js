const Discord = require('discord.js');
var jimp = require('jimp');

const client = new Discord.Client();


module.exports = {
    commands: ['picture', 'pic'],
    description: '*click click*',
    callback: async (message, args) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_128_BLACK) 
        let welcome = await jimp.read('https://cdn.discordapp.com/attachments/757768055479861278/758090856325709885/bh.jpeg').then(font => {
            jimp.read(member.user.displayAvatarURL).then(avatar => { //We take the user's avatar and declare it
            avatar.resize(128, 128) //We resize the avatar 
            welcome.composite(avatar, 20, 20) //We put the avatar on the image on the position 20, 20
    });
        welcome.write('Welcome2.png')
        
    message.channel.send(``, { files: ["Welcome2.png"] })
      

}
)}


}
