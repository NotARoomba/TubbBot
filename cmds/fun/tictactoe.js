const { stripIndents } = require('common-tags');
const { verify } = require('@util/util');
module.exports = class TicTacToeCommand extends Commando.Command {
	constructor(client) {
		super(client, {
            name: 'tic-tac-toe',
            aliases: ['ttt', 'tictactoe'],
			group: 'fun',
			memberName: 'tic-tac-toe',
			description: 'Play a game of tic-tac-toe with another user.',
			guildOnly: true,
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				}
			]
		});
	}

	async run(message, { opponent }) {
		const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
		if (opponent.bot) return message.reply('Bots may not be played against.');
		if (opponent.id === message.author.id) return message.reply('You may not play against yourself.');

		try {
			await message.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(message.channel, opponent);
			if (!verification) {
				return message.say('Looks like they declined...');
			}
			const sides = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
			const taken = [];
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			while (!winner && taken.length < 9) {
				const user = userTurn ? message.author : opponent;
				const sign = userTurn ? 'X' : 'O';
				await message.say(stripIndents`
					${user}, which side do you pick? Type \`end\` to forefeit.
					\`\`\`
					${sides[0]} | ${sides[1]} | ${sides[2]}
					—————————
					${sides[3]} | ${sides[4]} | ${sides[5]}
					—————————
					${sides[6]} | ${sides[7]} | ${sides[8]}
					\`\`\`
				`);
				const filter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					return sides.includes(choice) && !taken.includes(choice);
				};
				const turn = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 60000
				});
				if (!turn.size) {
					await message.say('Sorry, time is up!');
					if (lastTurnTimeout) {
						winner = 'time';
						break;
					} else {
						userTurn = !userTurn;
						lastTurnTimeout = true;
						continue;
					}
				}
				const choice = turn.first().content;
				if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : message.author;
					break;
				}
				sides[Number.parseInt(choice, 10) - 1] = sign;
				taken.push(choice);
				if (this.verifyWin(sides)) winner = userTurn ? message.author : opponent;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
			}
			if (winner === 'time') return message.say('Game ended due to inactivity.');
			return message.say(winner ? `Congrats, ${winner}!` : 'Oh... The cat won.');
		} catch (err) {
			throw err;
		}
	}

	verifyWin(sides) {
		return (sides[0] === sides[1] && sides[0] === sides[2])
			|| (sides[0] === sides[3] && sides[0] === sides[6])
			|| (sides[3] === sides[4] && sides[3] === sides[5])
			|| (sides[1] === sides[4] && sides[1] === sides[7])
			|| (sides[6] === sides[7] && sides[6] === sides[8])
			|| (sides[2] === sides[5] && sides[2] === sides[8])
			|| (sides[0] === sides[4] && sides[0] === sides[8])
			|| (sides[2] === sides[4] && sides[2] === sides[6]);
	}
};
