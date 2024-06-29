var mongoose = require('mongoose');
const mongodb = require('mongodb');
const dbName = 'AttendanceApp';
require('dotenv').config();
const db_url = `${process.env.DB_URL}/${dbName}`;
const MongoClient = mongodb.MongoClient;
module.exports = { mongodb, dbName, db_url, MongoClient };

// db connection
const dbConnect = async() => {
  try {
    // const connectionParams = {useNewUrlParser: true}
    const connection = await mongoose.connect(db_url);
    console.log('Connected to MongoDB');
    return connection
  } catch (error) {
    console.log('Failed to connect to MongoDB', error);
  }   
}

module.exports = dbConnect;