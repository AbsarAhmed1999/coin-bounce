const mongoose = require("mongoose");
const { MONGO_DB_CONNECTION_STRING } = require("../config/index");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(MONGO_DB_CONNECTION_STRING);
    console.log(`Datbase connected to host : ${conn.connection.host} `);
  } catch (error) {
    console.log(`Error : ${error}`);
  }
};

module.exports = dbConnection;
