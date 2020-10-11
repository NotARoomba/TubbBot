const loadCommands = require(`@root/commands/load-commands`)
const { prefix } = require(`@root/config.json`)
const Discord = require(`discord.js`)
const client = new Discord.Client()

module.exports = {
  commands: [`helphelEmbed2`, `h2`],
  description: "Describes all of this bot`s commands",
  async callback (message, arguments, text)  {

    


    await m.react('⬅');
    await m.react('➡');
    await m.react('🗑');

    const filter = (reaction, user) => {
      return ['⬅', '➡', '🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    
    message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
    
        if (reaction.emoji.name === '⬅') {
          message.reply('you reacted with a thumbs up.');
        } if (reaction.emoji.name === '➡'){
          message.reply('you reacted with a thumbs down.');
        } if (reaction.emoji.name === '🗑'){
          message.reply('you reacted with a thumbs down.');
      })
      .catch(collected => {
        message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
      });