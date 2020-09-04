const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect('mongodb+srv://L061571C5:89euzXX8IylP1DYn@tubbbot.kfqqn.mongodb.net/data?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}