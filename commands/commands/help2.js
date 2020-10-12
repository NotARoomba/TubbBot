const { Menu } = require('discord.js-menu');
const Discord = require(`discord.js`)
const client = new Discord.Client()

module.exports = {
  commands: [`helphelEmbed2`, `h2`],
  description: "Describes all of this bot`s commands",
  async callback (message, arguments, text)  {
    
          
      
      // Provide a menu with a channel, an author ID to let control the menu, and an array of menu pages.
          let helpMenu = new Menu(message.channel, message.author.id, [
              // Each object in this array is a unique page.
              {
                name: 'system',
                content: new Discord.MessageEmbed({
                    title: 'System',
                    description: `This command shows Tubb's commands`
                }),
                reactions: {
                    '▶': 'general',
                    '⏹': 'delete'
                }
            },
              {
                  // A page object consists of a name, used as a destination by reactions...
                  name: 'general',
                  // A MessageEmbed to actually send in chat, and...
                  content: new Discord.MessageEmbed({
                      title: 'General Commands',
                      description: 'add, Adds two numbers \n  sys, Sysinfo.exe \n help, Shows this menu \n msgdel, Message Genocide \n ping, Find your ping to me!'
                   
                      
                  }),
                  // A set of reactions with destination names attached.
                  // Note there's also special destination names (read below)
                  reactions: {
                      '▶': 'economy',
                      '◀': 'system'
                      
                  }
              },
              {
                  name: 'economy',
                  content: new Discord.MessageEmbed({
                      title: 'Economy',
                      description: 'addbal, Money for the Admins \n  balance (bal), Check your d̶e̶b̶t̶  balance \n pay, Got Cash? \n'
                  }),
                  reactions: {
                      '◀': 'general',
                      '▶': 'moderation'
                  }
              },
              {
                name: 'moderation',
                content: new Discord.MessageEmbed({
                    title: 'Moderation',
                    description: 'ban, BAN HAMMER TIME!! \n  kick, Kicks someone somewhere? \n mute, Muhn mhuuthm mhee \n unban, Reinstatement to this Server! \n unmute, Oh I can talk now?'
                }),
                reactions: {
                    '◀': 'economy',
                    '▶': 'music'
                }
            },
            {
              name: 'music',
              content: new Discord.MessageEmbed({
                  title: 'Music',
                  description: 'loop, Toggle music loop \n  lyrics (ly), Get lyrics for the currently playing song \n nowplaying (np), Show now playing song \n pause, Pause the currently playing music \n play (p), Plays audio from YouTube or Soundcloud \n playlist (pl), Play a playlist from youtube \n pruning, Toggle pruning of bot messages \n queue (q), Show the music queue and now playing \n remove (r), Remove song from the queue \n resume, Resume currently playing music \n search, Search and select videos to play \n shuffle, Shuffle queue \n skip (s), Skip the currently playing song \n skipto (st), Skip to the selected queue number \n stop, Stops the music \n volume (v), Change volume of currently playing music'
              }),
              reactions: {
                  '◀': 'moderation',
                  '▶': 'roles'
              }
            },
            {
                name: 'roles',
                content: new Discord.MessageEmbed({
                    title: 'Roles',
                    description: 'giverole (addrole), Gives someone a role \n removerole (derole), Loss of Privileges'
                }),
                reactions: {
                    '◀': 'music',
                }
            }  
              
              
              // The last parameter is the number of milliseconds you want the menu to collect reactions for each page before it stops to save resources
              // The timer is reset when a user interacts with the menu.
              // This is optional, and defaults to 180000 (3 minutes).
          ], 300000)
          // Run Menu.start() when you're ready to send the menu in chat.
          // Once sent, the menu will automatically handle everything else.
          helpMenu.start()
      
  
    
      } 
   }
 