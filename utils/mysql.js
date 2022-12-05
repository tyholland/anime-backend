const mysql = require('mysql');
let connection;

const connectToDB = () => {
  connection = mysql.createConnection({
    host: process.env.REACT_APP_MYSQL_HOST,
    user: process.env.REACT_APP_MYSQL_USER,
    password: process.env.REACT_APP_MYSQL_PWD,
    database: process.env.REACT_APP_MYSQL_NAME,
    port: process.env.REACT_APP_MYSQL_PORT
  });

  connection.connect();
  return connection;
};

module.exports.instance = () => {
  if (connection) {
    return connection;
  }

  return connectToDB();
};
