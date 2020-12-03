
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
		const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply('Please enter a voice channel first.');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
			return message.reply('I\'m missing the "Connect", "Speak", or "View Channel" permission for this channel.');
		}
		if (!voiceChannel.joinable) return message.reply('Your voice channel is not joinable.');
		if (this.client.voice.connections.has(voiceChannel.guild.id)) {
			return message.reply('I am already in a voice channel.');
		}
		await voiceChannel.join();
		return message.reply(`Joined **${voiceChannel.name}**!`);
	}
};
