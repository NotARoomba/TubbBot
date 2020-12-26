const axios = require('axios')
const exampleEmbed = (
    temp,
    maxTemp,
    minTemp,
    pressure,
    humidity,
    wind,
    cloudness,
    icon,
    author,
    profile,
    cityName,
    country
) =>
    new Discord.MessageEmbed()
        .setColor('#484848')
        .setAuthor(`Hello, ${author}`, profile)
        .setTitle(`It is ${temp * 9 / 5 + 32}\u00B0 F in ${cityName}, ${country}`)
        .addField(`Maximum Temperature:`, `${maxTemp * 9 / 5 + 32}\u00B0 F`, true)
        .addField(`Minimum Temperature:`, `${minTemp * 9 / 5 + 32} \u00B0 F`, true)
        .addField(`Humidity:`, `${humidity} %`, true)
        .addField(`Wind Speed:`, `${wind} m/s`, true)
        .addField(`Pressure:`, `${pressure} hpa`, true)
        .addField(`Cloudiness:`, `${cloudness}`, true)
        .setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
        .setFooter('Powered by OpenWeatherMap.org');

module.exports = class WeatherCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            aliases: ['w'],
            group: 'fun',
            memberName: 'weather',
            description: 'Returns the weather for a location',
            guildOnly: true,
            args: [
                {
                    key: 'location',
                    prompt: 'What city do you want to get the weather for?',
                    type: 'string'
                },
            ]
        });
    }
    run(message, { location }) {

        logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=04222de0b070f0e94c8874434d22d029`
            )
            .then(response => {
                let apiData = response;
                let currentTemp = Math.ceil(apiData.data.main.temp)
                let maxTemp = apiData.data.main.temp_max;
                let minTemp = apiData.data.main.temp_min;
                let humidity = apiData.data.main.humidity;
                let wind = apiData.data.wind.speed;
                let author = message.author.username
                let profile = message.author.displayAvatarURL
                let icon = apiData.data.weather[0].icon
                let cityName = location
                let country = apiData.data.sys.country
                let pressure = apiData.data.main.pressure;
                let cloudness = apiData.data.weather[0].description;
                message.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
            }).catch(err => {
                //console.log(err)
                message.reply(`Enter a valid city name`)
            })
    }
}
