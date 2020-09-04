const mongoose = require('mongoose')
const mongoPath = "mongodb://0.0.0.0:27017/data"

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}