const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { verify } = require('@util/util');

module.exports = class TicTacToeCommand extends Command {
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

	async run(msg, { opponent }) {
		console.log(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');

		try {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) {
				return msg.say('Looks like they declined...');
			}
			const sides = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
			const taken = [];
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			while (!winner && taken.length < 9) {
				const user = userTurn ? msg.author : opponent;
				const sign = userTurn ? 'X' : 'O';
				await msg.say(stripIndents`
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
				const turn = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 60000
				});
				if (!turn.size) {
					await msg.say('Sorry, time is up!');
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
					winner = userTurn ? opponent : msg.author;
					break;
				}
				sides[Number.parseInt(choice, 10) - 1] = sign;
				taken.push(choice);
				if (this.verifyWin(sides)) winner = userTurn ? msg.author : opponent;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
			}
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(winner ? `Congrats, ${winner}!` : 'Oh... The cat won.');
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
