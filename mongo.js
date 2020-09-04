const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect('mongodb://localhost:27017/data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}