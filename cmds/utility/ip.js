const Discord = require('discord.js');
const axios = require('axios')
module.exports = {
    name: 'ip',
    group: 'utility',
    description: 'Responds with information on an ip.',
    async execute(message, ip) {
        try {
            await axios
                .get(`http://api.ipstack.com/${ip}?access_key=${process.env.IP_STACK}&output=json`)
                .then((response) => {
                    const data = response.data
                    if (data.longitude == null || undefined) {
                        message.reply(`That is not a valid ip`)
                        return
                    }
                    const embed = new Discord.MessageEmbed()
                        .setColor('#484848')
                        .setTitle(`Results for: ${data.ip}`)
                        .setThumbnail(`https://www.countryflags.io/${data.country_code}/flat/64.png`)
                        .addField('❯ Country', data.country_name)
                        .addField('❯ State', data.region_name)
                        .addField('❯ City', data.city)
                        .addField('❯ Zip Code', data.zip)
                        .addField('❯ Latitude', data.longitude)
                        .addField('❯ Longitude', data.latitude)
                    return message.embed(embed);
                }, (error) => {
                    console.log(error);
                })
        } catch (err) {
            if (err.status === 404) return message.say('Could not find any results.');
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}