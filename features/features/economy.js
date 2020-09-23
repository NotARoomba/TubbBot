const mongo = require('@util/mongo')
const profileSchema = require('@schemas/profile-schema')

const toolsCache = {} // { 'guildId-userId': tools }

module.exports = (client) => {}

module.exports.addCoins = async (guildId, userId, tools) => {
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
            tools,
          },
        },
        {
          upsert: true,
          new: true,
        }
      )

      toolsCache[`${guildId}-${userId}`] = result.tools

      return result.tools
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.getCoins = async (guildId, userId) => {
  const cachedValue = toolsCache[`${guildId}-${userId}`]
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

      let tools = 0
      if (result) {
        tools = result.tools
      } else {
        console.log('Inserting a document')
        await new profileSchema({
          guildId,
          userId,
          tools,
        }).save()
      }

      toolsCache[`${guildId}-${userId}`] = tools

      return tools
    } finally {
      
    }
  })
}