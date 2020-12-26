
const { Readable } = require('stream');
const { list, reactIfAble } = require('@util/util');
const voices = require('@assets/vocodes');
module.exports = class VocodesCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'vocodes',
			aliases: ['vocode'],
			group: 'music',
			memberName: 'vocodes',
			description: 'Speak text like a variety of famous figures.',
			details: `**Voices:** ${Object.keys(voices).join(', ')}`,
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Vocodes',
					url: 'https://vo.codes/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'voice',
					prompt: `What voice do you want to use? Either ${list(Object.keys(voices), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(voices),
					parse: voice => voices[voice.toLowerCase()]
				},
				{
					key: 'text',
					prompt: 'What text do you want to say?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(message, { voice, text }) {

		logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
		const connection = this.client.voice.connections.get(message.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return message.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		try {
			await reactIfAble(message, this.client.user, '💬');
			const { body } = await request
				.post('https://mumble.stream/speak_spectrogram')
				.send({
					speaker: voice,
					text
				});
			connection.play(Readable.from([Buffer.from(body.audio_base64, 'base64')]));
			await reactIfAble(message, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(message, this.client.user, '⚠️');
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
