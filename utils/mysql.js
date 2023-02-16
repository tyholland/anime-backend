const mysql = require('mysql');
const util = require('util');
let connection;

const connectToDB = () => {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  };

  if (process.env.SERVER_ENV === 'prod') {
    config.socketPath = process.env.INSTANCE_UNIX_SOCKET;
  } else {
    config.host = process.env.DB_HOST;
    config.port = process.env.DB_PORT;
  }

  connection = mysql.createConnection(config);

  connection.connect();
  return util.promisify(connection.query).bind(connection);
};

module.exports.instance = () => {
  if (connection) {
    return util.promisify(connection.query).bind(connection);
  }

  return connectToDB();
};
