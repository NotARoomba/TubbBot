const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect('mongodb+srv://L061571C5:Joeblow6@tubbbot.kfqqn.mongodb.net/data?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}