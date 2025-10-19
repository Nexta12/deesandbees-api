const mongoose = require('mongoose');


const connectDB = async () => {
  try {
     await mongoose.connect(process.env.MONGO_URI);
    console.info(`Server connected to Database`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB
