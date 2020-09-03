const mongo = require('./mongo')
const profileSchema = require('./schemas/profile-schema')

module.exports = (client) => {}

module.exports.getCoins = async (guildId, userId) => {
    return await mongo().then(async mongoose => {
        try {
            console.log('Running findOne()')

            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            console.log("RESULT", result)

            let coins = 0
            if (result) {
                coins = result.coins
            } else{
                consile.log('Inserting a document')
                await new profileSchema({
                    guildId,
                    userId,
                    coins
                }).save()
            }
        
            return coins
        } finally {
            mongoose.connection.close()
        }
    })
}
