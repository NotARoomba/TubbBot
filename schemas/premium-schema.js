const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const premiumSchema = mongoose.Schema(
  {
    userId: String,
    guildId: String,
    expires: {
      type: Date,
      required: true,
    },
    current: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('premium', premiumSchema)