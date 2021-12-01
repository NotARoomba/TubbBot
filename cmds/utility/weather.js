const Discord = require("discord.js");
const axios = require('axios');
const { toTitleCase } = require('../../function.js')
module.exports = {
    name: 'weather',
    group: 'utility',
    usage: `weather (city)`,
    aliases: ['w'],
    description: 'Returns the weather for a city',
    execute(message, location) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=04222de0b070f0e94c8874434d22d029`).then(response => {
            const embed = new Discord.MessageEmbed()
                .setColor('#484848')
                .setTitle(`It is ${Math.round((response.data.main.temp * 9 / 5) + 32)}\u00B0 F in ${response.data.name}, ${response.data.sys.country}`)
                .addField(`Maximum Temperature:`, `${(Math.round(response.data.main.temp_max * 9 / 5) + 32)}\u00B0 F`, true)
                .addField(`Minimum Temperature:`, `${(Math.round(response.data.main.temp_min * 9 / 5) + 32)} \u00B0 F`, true)
                .addField(`Humidity: `, `${response.data.main.humidity} % `, true)
                .addField(`Wind Speed: `, `${response.data.wind.speed} m / s`, true)
                .addField(`Pressure: `, `${response.data.main.pressure} hpa`, true)
                .addField(`Cloudiness: `, `${toTitleCase(response.data.weather[0].description)} `, true)
                .setThumbnail(`http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`)
                .setFooter('Powered by OpenWeatherMap.org');
            message.channel.send(embed);
        }).catch(err => {
            console.log(err)
            message.reply(`Enter a valid city name`)
        })
    }
}