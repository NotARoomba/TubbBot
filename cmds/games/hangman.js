const Discord = require('discord.js');
const path = require("path");
const fs = require("fs");
const { preGame } = require("../../function.js")
module.exports = {
	name: 'hangman',
	group: 'games',
	usage: `hangman [letter to guess if playing]`,
	description: 'Play a game of hangman!',
	async execute(message, args) {
		if (await preGame(message, args, module.exports.name, "guess a letter", { completed: [], check: null, life: null, word: [] })) { return }
		let life = 0
		let word = []
		let completed = []
		let check
		let ind = 0
		let wordarr = await fs.readFileSync(path.resolve(__dirname, '../../assets/hangman/words.txt')).toString().split("\n")
		for (i = 0; i < message.guild.games.length; i++) {
			if (message.guild.games[i].id == message.author.id && message.guild.games[i].game == module.exports.name) {
				ind = i
				if (message.guild.games[i].word.length == 0) {
					word = wordarr[Math.floor(Math.random() * wordarr.length)].split("")
					message.guild.games[i].life = 0
					for (s = 0; s < word.length; s++) {
						completed.push('_')
					}
					message.guild.games[i].check = word.join("")
				} else {
					life = message.guild.games[i].life
					word = message.guild.games[i].word
					completed = message.guild.games[i].completed
					check = message.guild.games[i].check
				}
			}
		}
		if (args.length < 1 || args.length == 0) { return message.reply("you need to guess 1 letter.") }
		args = args.toLowerCase()[0]
		if (word.indexOf(args) != -1) {
			while (word.indexOf(args) != -1) {
				completed[word.indexOf(args)] = args
				word[word.indexOf(args)] = '_';
			}
			life--
		}
		life++
		if (completed.join("") == check) {
			message.reply("you win!")
			await module.exports.printHangman(7, message);
			message.channel.send(`The word was: \`\`\`${check}\`\`\``)
			for (i = 0; i < message.guild.games.length; i++) {
				if (message.guild.games[i].id == message.author.id) {
					message.guild.games.splice(i)
				}
			}
			return
		} else if (life == 6) {
			message.reply("you lost...")
			await module.exports.printHangman(6, message);
			message.channel.send(`The word was: \`\`\`${check}\`\`\``)
			for (i = 0; i < message.guild.games.length; i++) {
				if (message.guild.games[i].id == message.author.id) {
					message.guild.games.splice(i)
				}
			}
			return
		} else {
			message.guild.games[ind].completed = completed
			message.guild.games[ind].word = word
			message.guild.games[ind].life = life
			message.channel.send(`\`\`\`${completed.join(" ")}\`\`\``)
			await module.exports.printHangman(life, message);
		}
	},
	async printHangman(index, message) {
		index *= 9;
		currentLine = 0;
		let msg = "";
		let hangmanFile = await fs.readFileSync(path.resolve(__dirname, '../../assets/hangman/hangman.txt')).toString().split("\n");
		for (i = 0; i < hangmanFile.length; i++) {
			if (i >= index + 9) { continue; }
			if (i >= index) { msg += hangmanFile[i] + "\n"; }
		}
		message.channel.send(msg)
	}
}