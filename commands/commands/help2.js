const loadCommands = require(`@root/commands/load-commands`)
const { prefix } = require(`@root/config.json`)
const Discord = require(`discord.js`)
const client = new Discord.Client()

module.exports = {
  commands: [`helphelEmbed2`, `h2`],
  description: "Describes all of this bot`s commands",
  async callback (message, arguments, text)  {
    const commands = loadCommands()
    let pages = ['General Commands', 'Economy Commands', 'Moderation Commands']; 
let page = 1; 


let embed = new Discord.MessageEmbed()
.setColor("#15f153")
.setFooter(`Page ${page} of ${pages.length}`)
.setDescription(pages[page-1])

message.channel.send(embed).then(msg => {

msg.react('⬅️').then( r => {
msg.react('➡️')

// Filters
const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === message.author.id;
const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === message.author.id;

const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000});
const forwards = msg.createReactionCollector(forwardsFilter, {timer: 6000});

backwards.on('collect', r => {
if (page === 1) return;
page--;
embed.setDescription(pages[page-1]);
embed.setFooter(`Page ${page} of ${pages.length}`);
msg.edit(embed)

r.users.remove(r.users.cache.filter(u => u === message.author).first())

})

forwards.on('collect', r => {
if (page === pages.length) return;
page++;
embed.setDescription(pages[page-1]);
embed.setFooter(`Page ${page} of ${pages.length}`);
msg.edit(embed)

r.users.remove(r.users.cache.filter(u => u === message.author).first())
})
})
})
}}