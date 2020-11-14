const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const serverSchema = mongoose.Schema({
  _id: reqString,
  channelId: reqString,
  text: reqString,
  image: reqString,
  color: reqString,
  prefix: {
    default: '-',
    type: reqString,
  },
})

module.exports = mongoose.model('server-settings', serverSchema)