const Discord = require('discord.js');
const client = new Discord.Client();
const Canvas = require('canvas-constructor');
const background = 'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v268batch2-kul-02_2.jpg?bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&q=80&usm=15&vib=3&w=1300&s=a5cfc956068e95f97f6df92d9d96439c'



module.exports = {
    commands: ['picture2', 'pic2'],
    description: '*click click*',
    callback: async (client, message, args) => {
        
        
        try {

            async function createCanvas() { // here we create the canvas function and make sure it's a async function.
            
                var imageUrlRegex = /\?size=2048$/g;
                var AUTHOR_NAME = message.author.username; // as I said before I like to use variables for everything, this one is for the user name. example: @Sphinix
                var AUTHOR_TAG = message.author.tag; // this one is for the user tag. example: @Sphinix#0001
                var AUTHOR_TAG_LENGTH = AUTHOR_TAG.length > 10 ? AUTHOR_TAG.substring(0, 12) + ".." : AUTHOR_TAG; // with this you can set a limit for the length so if the user tag is longer than 10 characters it's gonna cut the name and add .. to it ,you don't have to include that
                var AUTHOR_NAME_LENGTH = AUTHOR_NAME.length > 10 ? AUTHOR_NAME.substring(0, 12) + ".." : AUTHOR_NAME; // same thing for the user name
                var { body: avatar } = await get(message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }).replace(imageUrlRegex, "?size128")); // this is gonna be the user avatar
                var { body: defaultbackground } = await get(background); // this is gonna be the background we have at line 15

                return new Canvas(820, 360) // lets customize our canvas, Canvas(Width, Height) in my case I want the canvas width to be 820 and the Height 360
                    .addImage(defaultbackground, 0, 0, 820, 360) // lets start by adding the background, .addImage(variable, SX, SY, X, Y), in our case we want the background to be at the same exact size as the canvase to replace the X,Y with the canvas width and height at line 54
                    .addRoundImage(avatar, 335, 35, 150, 150, 150 / 2) // now lets add the avatar, we want the avatar to be round image, so we use RoundImage, (x: number, y: number, width: number, height: number, radius), in our case I want the avatar position to be at (335, 35) and the size(150, 150, 150 / 2)
                    // now lets add some text !!
                    .setColor("#ffffff") // this is gonna be the color of the text
                    .setTextAlign('center') // we want the text to be centered 
                    .setTextFont('30px sans-serif') // this is gonna be the text font, remember at line 12 we required our custom font and we gave it a name "BebasNeueRegular"
                    .addText(WELCOME_MESSAGE_TITLE, 410.6, 228.1) // lets add the title that we required at line 36, .addText(the variable, X, Y) in my case I want the text to be at this postion the variable, X: 410.6 and Y: 228.1
                    // now we are done with the title, let add the welcome message text that we required at line 37, but now we are gonna change the text size
                    .setTextFont('25px sans-serif') // as you can see we are still using the same name but the size is different, we changed the size from 30px to 25px
                    .addText(WELCOME_MESSAGE_TEXT, 410.6, 276.1) // lets add the text that we required at line 37
                    // now we are good to go!, you can use the variables we required at line 46 - 52 for more additions 
                    .toBuffer() // you don't have to use this if you don't know what Buffer means
            }

            // now lets send the attachment to the channel !
            await message.send(attachment)
            const attachment = new MessageAttachment(await createCanvas(), 'welcome.png')
        } catch (e) {
            message.send(`Oh no an error occurred :( \`${e.message}\` try again later.`); // you can replace message.channel.send with console.log if you don't to get the error message in the channel
        }

    }

};