module.exports = class SummonCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'summon',
            group: 'util',
            memberName: 'summon',
            description: '*Holy Music stops*',
            args: [
                {
                    key: 'user',
                    prompt: 'What user would you like to summon?',
                    type: 'user',
                }
            ]
        });
    }

    run(message, { user }) {
        message.say(`Summoning ${user}`)
        message.say(`${user}`)
        message.say(`${user}`)
        message.say(`${user}`)
        message.say(`${user}`)
    }
}