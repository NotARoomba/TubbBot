const mongo = require('@util/mongo')
const profileSchema = require('@schemas/profile-schema')

<<<<<<< HEAD
const toolsCache = {} // { 'guildId-userId': tools }
=======

const strandsCache = {} // { 'guildId-userId': strands }
>>>>>>> parent of 571098a... jbk.

module.exports = (client) => {}

module.exports.addCoins = async (guildId, userId, strands) => {
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
        },
        {
          upsert: true,
          new: true,
        }
      )

<<<<<<< HEAD
      toolsCache[`${guildId}-${userId}`] = result.tools
=======
      console.log('RESULT:', result)

      strandsCache[`${guildId}-${userId}`] = result.strands
>>>>>>> parent of 571098a... jbk.

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

  return await mongo().then(async (mongoose) => {
    try {
      console.log('Running findOne()')

      const result = await profileSchema.findOne({
        guildId,
        userId,
      })

<<<<<<< HEAD
      let tools = 0
=======
      console.log('RESULT:', result)

      let strands = 0
>>>>>>> parent of 571098a... jbk.
      if (result) {
        strands = result.strands
      } else {
        console.log('Inserting a document')
        await new profileSchema({
          guildId,
          userId,
          strands,
        }).save()
      }

<<<<<<< HEAD
      toolsCache[`${guildId}-${userId}`] = tools
=======
      strandsCache[`${guildId}-${userId}`] = strands
      
>>>>>>> parent of 571098a... jbk.

      return strands
    } finally {
      mongoose.connection.close()
    }
  })
}