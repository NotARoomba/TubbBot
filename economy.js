const mongo = require('./mongo')
const profileSchema = require('./schemas/profile-schema')
const inventory = require('./commands/economy/inventory')

const strandsCache = {} // { 'guildId-userId': strands }
const invCache = {}

module.exports = (client) => {}

module.exports.addCoins = async (guildId, userId, strands, inventoryItems) => {
  return await mongo().then(async (mongoose) => {
    try {
      console.log('Running findOneAndUpdate()')

      const result = await profileSchema.findOneAndUpdate(
        {
          guildId,
          userId,
        },
        {
          guildId,
          userId,
          $inc: {
            strands,
          },
          inventoryItems
        },
        {
          upsert: true,
          new: true,
        }
      )

      console.log('RESULT:', result)

      strandsCache[`${guildId}-${userId}`] = result.strands
      strandsCache[`${guildId}-${userId}`] = result.inventoryItems

      return result.strands
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.getCoins = async (guildId, userId) => {
  const cachedValue = strandsCache[`${guildId}-${userId}`]
  if (cachedValue) {
    return cachedValue
  }
module.exports.getinv = async (guildId, userId) => {
  const cachedValue = invCache[`${guildId}-${userId}`]
  if (cachedValue) {
     return cachedValue
  }

  return await mongo().then(async (mongoose) => {
    try {
      console.log('Running findOne()')

      const result = await profileSchema.findOne({
        guildId,
        userId,
      })

      console.log('RESULT:', result)

      let strands = 0
      if (result) {
        strands = result.strands
      } else {
        console.log('Inserting a document')
        await new profileSchema({
          guildId,
          userId,
          strands,
          inventoryItems,
        }).save()
      }

      strandsCache[`${guildId}-${userId}`] = strands
      invCache[`${guildId}-${userId}`] = inventoryItems

      return strands
    } finally {
      mongoose.connection.close()
    }
  })
}
}
