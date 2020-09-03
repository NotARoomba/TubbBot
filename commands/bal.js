const fs = require('fs');
const money = require("../money.json");

const Discord = require('discord.js');

const client = new Discord.Client();

module.exports = {
    name: 'bal',
    description: "this is the balance command!",
    execute(message, args){

        if(!args[0]) {
            var user = message.author;
        } else {
            var user = message.mentions.users.first() || client.user.get(args[0]);
        }

        if(!money[user.id]) {
            money[user.id] = {
                name: client.user.get(user.id).tag,
                money: 0
            }
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
        } 

        return message.channel.send(`${bot.user.get(user.id).username} has $${money[user.id].money}.`);

    }

};