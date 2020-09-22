const mongo = require('@util/mongo')
const xpSchema = require('@schemas/xp-schema')



module.exports = (client) => {}


function xp(message) {
    if (!client.cooldown.has(`${message.author.id}`) || !(Date.now() - client.cooldown.get(`${message.author.id}`) > client.config.cooldown)) {
        let xp = client.mongo.add(`xp_${message.author.id}`, 1);
        let level = Math.floor(0.3 * Math.sqrt(xp));
        let lvl = client.mongo.get(`level_${message.author.id}`) || client.mongo.set(`level_${message.author.id}`,1);;
        if (level > lvl) {
            let newLevel = client.mongo.set(`level_${message.author.id}`,level);
            message.channel.send(`:tada: ${message.author.toString()}, You just advanced to level ${newLevel}!`);
        }
        client.cooldown.set(`${message.author.id}`, Date.now());
    }
}