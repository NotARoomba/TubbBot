const Discord = require('discord.js');
const client = new Discord.Client();
const discordTTS = require("discord-tts");

module.exports = {
    commands: ['texttospeech', 'tts'],
    minArgs: 0,
    maxArgs: 0,
    description: 'Discord Text To Speech',
     callback (message, client) {
        const voiceChannel = message.member.voice.channel;
        voiceChannel.join().then(connection => {
            const stream = discordTTS.getVoiceStream("this is a test cookie");
            const dispatcher = connection.play(stream);
            dispatcher.on("finish",()=>voiceChannel.leave())
        });
     }
}