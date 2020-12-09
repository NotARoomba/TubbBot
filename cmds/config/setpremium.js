
module.exports = class DotsAndBoxesCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setpremium',
			aliases: ['sp'],
			group: 'config',
			memberName: 'setpremium',
			description: 'Gives a person or server premium',
			ownerOnly: true,
			args: [
				{
					key: 'User',
					prompt: 'What user bought premium',
					type: 'user'
                },
                {
					key: 'Guild',
					prompt: 'What guild should have premium',
					type: 'string'
                },
                {
					key: 'time',
					prompt: 'How long should they have premium',
					type: 'string'
				}
			]
		});
    }
    run = async (message, { User, Guild, time }) => {
        const { channel } = message
        const previousPremium = await premiumSchema.find({
            guildId: Guild,
          })
      
          const currentlyPremium = previousPremium.filter((premium) => {
            return premium.current === true
          })
      
          if (currentlyPremium.length) {
            message.reply('That Guild already has Premium')
            return
          }
          let duration = time
          const expires = new Date()
    expires.setHours(expires.getMonth() + duration)
    let guildset = this.client.guilds.cache.get(Guild)
    if (guildset === undefined || null) {
        message.reply('That guild doesnt have Tubb')
        return
    }
    await new premiumSchema(
      {
        _id: Guild,
      },
      {
        _id: Guild,
        userId: User.id,
        expires,
        current: true,
      }).save()
      
      channel.send(
        `:champagne: ${User}, Thank you for buying Premium! :champagne_glass:`
      )
    }
}