const Discord = require('discord.js')
const client = new Discord.Client()
const fetch = require('node-fetch');
const { newsAPI } = require('@root/config.json');


module.exports = {
    commands: ['worldnews', 'wn'],
    minArgs: 0,
    maxArgs: 0,
    description: 'Get the World News',
     callback: async (message) => {
      console.log(`Command: worldnews 
      Ran by: ${message.author.tag}
      Server: ${message.guild.name}
      Date: ${new Date()}`)
        try {
            const response = await fetch(
              `https://newsapi.org/v2/top-headlines?sources=reuters&pageSize=5&apiKey=${newsAPI}`
            );
            const json = await response.json();
            const articleArr = json.articles;
            let processArticle = article => {
              const embed = new Discord.MessageEmbed()
                .setColor('#FF4F00')
                .setTitle(article.title)
                .setURL(article.url)
                .setAuthor(article.author)
                .setDescription(article.description)
                .setThumbnail(article.urlToImage)
                .setTimestamp(article.publishedAt)
                .setFooter('Powered by NewsAPI.org');
              return embed;
            };
            async function processArray(array) {
              for (const article of array) {
                const msg = await processArticle(article);
                message.reply(msg);
              }
            }
            await processArray(articleArr);
          } catch (e) {
            message.reply(':x: Something failed along the way!');
            return console.error(e);
          }
        }
    
    }