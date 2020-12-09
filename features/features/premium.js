
const channel = '785933554621481011'

module.exports = (client) => {
    const checkPremium = async () => {
      console.log('CHECKING PREMIUM DATA')
  
      const now = new Date()
  
      const conditional = {
        expires: {
          $lt: now,
        },
        current: true,
      }
      await premiumSchema.deleteMany({current: false})
      const results = await premiumSchema.find(conditional)
      console.log('results:', results)
  
      if (results && results.length) {
        for (const result of results) {
          const { _id, userId } = result
  
          const guild = client.guilds.cache.get(_id)
          const member = (await guild.members.fetch()).get(userId)
  
          channel.send(`<@${member.tag}>'s premium ran out`)
        }
  
        await premiumSchema.updateMany(conditional, {
          current: false,
        
        })
        await premiumSchema.deleteMany({current: false})
      }

      setTimeout(checkPremium, 1000 * 60 * 10)
    }
    checkPremium()

  }