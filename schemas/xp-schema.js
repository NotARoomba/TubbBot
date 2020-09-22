const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const xpSchema = mongoose.Schema({
  guildId: reqString,
  userId: reqString,
  xp: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('xp', xpSchema)