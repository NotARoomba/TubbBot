const { stripIndents } = require('common-tags');
const { delay, verify } = require('@util/util');
const startWords = require('@assets/wordlist');
module.exports = class WordChainCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'wordchain',
			aliases: ['wc'],
			group: 'fun',
			memberName: 'wordchain',
			description: 'Try to come up with words that start with the last letter of your opponent\'s word.',
			guildOnly: true,
			credit: [
				{
					name: 'Grady Ward',
					url: 'https://en.wikipedia.org/wiki/Grady_Ward',
					reason: 'Moby Word Lists',
					reasonURL: 'http://www.gutenberg.org/ebooks/3201'
				}
			],
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				},
				{
					key: 'time',
					prompt: 'How long do you want to wait for input of new words (in seconds)?',
					type: 'integer',
					default: 10,
					max: 10,
					min: 1
				}
			]
		});
	}

	async run(message, { opponent, time }) {
		const { guild, author } = message
		try {  const result = await premiumSchema.findOne({
			guildId: guild.id,
			userId: author.id,
		}) 
		if (result.guildId === undefined || result.userId === undefined) {
			message.reply('This is a Premium only command, you can get premium by supporting me!')
			return 
		}
	} catch (error) {
		console.log(error)
		message.reply('This is a Premium only command. You can get premium by supporting me!')
		return	
	}
		const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
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
			const startWord = startWords[Math.floor(Math.random() * startWords.length)];
			await message.say(stripIndents`
				The start word will be **${startWord}**! You must answer within **${time}** seconds!
				If you think your opponent has played a word that doesn't exist, respond with **challenge** on your turn.
				Words cannot contain anything but letters. No numbers, spaces, or hyphens may be used.
				The game will start in 5 seconds...
			`);
			await delay(5000);
			let userTurn = Boolean(Math.floor(Math.random() * 2));
			const words = [];
			let winner = null;
			let lastWord = startWord;
			while (!winner) {
				const player = userTurn ? message.author : opponent;
				const letter = lastWord.charAt(lastWord.length - 1);
				await message.say(`It's ${player}'s turn! The letter is **${letter}**.`);
				const filter = res =>
					res.author.id === player.id && /^[a-zA-Z']+$/i.test(res.content) && res.content.length < 50;
				const wordChoice = await message.channel.awaitMessages(filter, {
					max: 1,
					time: time * 1000
				});
				if (!wordChoice.size) {
					await message.say('Time!');
					winner = userTurn ? opponent : message.author;
					break;
				}
				const choice = wordChoice.first().content.toLowerCase();
				if (choice === 'challenge') {
					const checked = await this.verifyWord(lastWord);
					if (!checked) {
						await message.say(`Caught red-handed! **${lastWord}** is not valid!`);
						winner = player;
						break;
					}
					await message.say(`Sorry, **${lastWord}** is indeed valid!`);
					continue;
				}
				if (!choice.startsWith(letter) || words.includes(choice)) {
					await message.say('Sorry! You lose!');
					winner = userTurn ? opponent : message.author;
					break;
				}
				words.push(choice);
				lastWord = choice;
				userTurn = !userTurn;
			}

			if (!winner) return message.say('Oh... No one won.');
			return message.say(`The game is over! The winner is ${winner}!`);
		} catch (err) {
			throw err;
		}
	}

	async verifyWord(word) {
		if (startWords.includes(word.toLowerCase())) return true;
		try {
			const { body } = await request
				.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
				.query({ key: process.env.WEBSTER });
			if (!body.length) return false;
			return true;
		} catch (err) {
			if (err.status === 404) return false;
			return null;
		}
	}
};