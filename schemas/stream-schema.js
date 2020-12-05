const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
  }
  
  const streamSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString,
    text: reqString,
    image: reqString,
    color: reqString,
    prefix: reqString,
  })
  
  module.exports = mongoose.model('stream-settings', streamSchema)
