const mongoose = require('mongoose')
const { mongoPath } = require('./config.json')

module.exports = async () => {
  await mongoose.create.connection(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}