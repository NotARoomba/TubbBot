
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

		webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply(':no_entry: Please join a voice channel and try again!');
			return;
		}
		if (message.guild.musicData.isPlaying != true) {
			message.reply(':x: Nothing is Playing');
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
