const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const premiumSchema = mongoose.Schema(
  {
    _id: reqString,
    userId: reqString,
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