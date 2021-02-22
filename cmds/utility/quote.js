const { quotes } = require('../../assets/quotes.json')
module.exports = {
    name: 'quote',
    group: 'utility',
    description: 'Gets a quote form someone.',
    execute(message) {
        const { channel } = message
        const quote2 = quotes[Math.floor(Math.random() * quotes.length)]
        const { author } = quote2
        const { quote } = quote2
        channel.send(`${quote} \n -${author}`)
    }
}