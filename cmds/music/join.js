
module.exports = class JoinCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['join-voice-channel', 'join-vc', 'join-voice', 'join-channel'],
			group: 'music',
			memberName: 'join',
			description: 'Joins your voice channel.',
			guildOnly: true,
			guarded: true,
			userPermissions: ['CONNECT']
		});
	}

	async run(message) {

		client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply(':no_entry: Please join a voice channel and try again!');
			return;
		}
		try {
			await voiceChannel.join();
			return;
		} catch {
			message.reply(':x Something went wrong when moving channels');
			return;
		}
	}
};
