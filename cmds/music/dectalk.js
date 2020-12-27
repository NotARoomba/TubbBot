
const { Readable } = require('stream');
const { reactIfAble } = require('@util/util');
module.exports = class DECTalkCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'dec-talk',
			aliases: ['text-to-speech', 'tts'],
			group: 'music',
			memberName: 'dec-talk',
			description: 'The world\'s best Text-to-Speech.',
			guildOnly: true,
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'calzoneman',
					url: 'https://github.com/calzoneman',
					reason: 'API',
					reasonURL: 'https://github.com/calzoneman/aeiou'
				},
				{
					name: 'Digital Equipment Corporation',
					url: 'http://gordonbell.azurewebsites.net/digital/timeline/tmlnhome.htm',
					reason: 'Original DECTalk Software'
				},
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'Original "Moonbase Alpha" Game',
					reasonURL: 'https://store.steampowered.com/app/39000/Moonbase_Alpha/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to say?',
					type: 'string',
					max: 1024
				}
			]
		});
	}

	async run(message, { text }) {

		client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
		var voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
			return message.reply(
				':no_entry: Please join a voice channel and try again!'
			);


		const connection = this.client.voice.connections.get(message.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return message.reply(`I am not in a voice channel. Use ${usage} to fix that!`);

		}
		if (
			typeof message.guild.musicData.songDispatcher === undefined) { } else {
			message.guild.musicData.loopSong = false;
			message.guild.musicData.songDispatcher.pause();
			message.say('Song was skipped and paused because of dectalk.')
		}
		try {
			reactIfAble(message, this.client.user, '💬');
			const { body } = await request
				.get('http://tts.cyzon.us/tts')
				.query({ text });
			connection.play(Readable.from([body]));
			reactIfAble(message, this.client.user, '🔉');
			return null;
		} catch (err) {
			reactIfAble(message, this.client.user, '⚠️');
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};