const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
  }
  
  const streamSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString,
    streamer: reqString,
  })
  
  module.exports = mongoose.model('stream-settings', streamSchema)
