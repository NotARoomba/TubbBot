const mongoose = require('mongoose')
const mongoPath = "mongodb+srv://L061571C5:QUANTUM1955@tubbbot.oepus.mongodb.net/data?retryWrites=true&w=majority"

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}