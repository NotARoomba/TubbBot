const Discord = require('discord.js');
const { play } = require('./play');
const { isValidCommander } = require('../../function.js')
module.exports = {
	name: 'filters',
	group: 'music',
	usage: 'filters (filter)',
	aliases: ['filter'],
	description: 'Adds a filter to the current song!',
	async execute(message, args, client) {
		if (isValidCommander(message) !== true) return
		const [prefix] = await client.pool.query(`SELECT prefix FROM servers WHERE id = ${message.guild.id};`)
		switch (args) {
			case "bassboost":
				choice = { bassboost: 'bass=g=20' }
				break;
			case "8D":
				choice = { '8D': 'apulsator=hz=0.09' }
				break;
			case "vaporwave":
				choice = { vaporwave: 'aresample=48000,asetrate=48000*0.8' }
				break;
			case "nightcore":
				choice = { nightcore: 'aresample=48000,asetrate=48000*1.25' }
				break;
			case "phaser":
				choice = { phaser: 'aphaser=in_gain=0.4' }
				break;
			case "tremolo":
				choice = { tremolo: 'tremolo' }
				break;
			case "vibrato":
				choice = { vibrato: 'vibrato=f=6.5' }
				break;
			case "reverse":
				choice = { reverse: 'areverse' }
				break;
			case "treble":
				choice = { treble: 'treble=g=5' }
				break;
			case "normalizer":
				choice = { normalizer: 'dynaudnorm=g=101' }
				break;
			case "surrounding":
				choice = { surrounding: 'surround' }
				break;
			case "pulsator":
				choice = { pulsator: 'apulsator=hz=1' }
				break;
			case "subboost":
				choice = { subboost: 'asubboost' }
				break;
			case "karaoke":
				choice = { karaoke: 'stereotools=mlev=0.03' }
				break;
			case "flanger":
				choice = { flanger: 'flanger' }
				break;
			case "gate":
				choice = { gate: 'agate' }
				break;
			case "haas":
				choice = { haas: 'haas' }
				break;
			case "mcompand":
				choice = { mcompand: 'mcompand' }
				break;
			case "mono":
				choice = { mono: 'pan=mono|c0=.5*c0+.5*c1' }
				break;
			case "mstlr":
				choice = { mstlr: 'stereotools=mode=ms>lr' }
				break;
			case "mstrr":
				choice = { mstrr: 'stereotools=mode=ms>rr' }
				break;
			case "compressor":
				choice = { compressor: 'compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6' }
				break;
			case "expander":
				choice = { expander: 'compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3' }
				break;
			case "softlimiter":
				choice = { softlimiter: 'compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8' }
				break;
			case "chorus":
				choice = { chorus: 'chorus=0.7:0.9:55:0.4:0.25:2' }
				break;
			case "chorus2d":
				choice = { chorus2d: 'chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3' }
				break;
			case "chorus3d":
				choice = { chorus3d: 'chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3' }
				break;
			case "fadein":
				choice = { fadein: 'afade=t=in:ss=0:d=10' }
				break;
			case "clear":
				choice = 403;
				break;
			default:
				choice = 404;
				const embed = new Discord.MessageEmbed()
					.setColor("#c219d8")
					.setTitle("Not a valid Filter, use one of those:")
					.setDescription(`
                \`bassboost\`
                \`8D\`
                \`vaporwave\`
                \`nightcore\`
                \`phaser\`
                \`tremolo\`
                \`vibrato\`
                \`reverse\`
                \`treble\`
                \`normalizer\`
                \`surrounding\`
                \`pulsator\`
                \`subboost\`
                \`karaoke\`
                \`flanger\`
                \`gate\`
                \`haas\`
                \`mcompand\`
                \`mono\`
                \`mstlr\`
                \`mstrr\`
                \`compressor\`
                \`expander\`
                \`softlimiter\`
                \`chorus\`
                \`chorus2d\`
                \`chorus3d\`
                \`fadein\`
                \`clear\`   ---  removes all filters`)
					.setFooter(`Example: ${prefix[0].prefix}filter bassboost`)
				message.channel.send(embed)
				break;
		}
		if (choice === 404) return;
		try {
			message.guild.musicData.songDispatcher.pause();
			message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying)
			message.guild.musicData.queue[0].seek = Math.round(message.guild.musicData.songDispatcher.streamTime / 1000)
			choice === 403 ? message.guild.musicData.filters.length = 0 : message.guild.musicData.filters.push(choice)
			await play(message, message.guild.musicData.queue[0].voiceChannel)
			message.channel.send(`Succesfully applied the filter: ${args}`)
		} catch (err) { }
	}
}