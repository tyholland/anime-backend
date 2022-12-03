const knex = {
  host: process.env.REACT_APP_DB_HOST,
  user: process.env.REACT_APP_DB_USER,
  password: process.env.REACT_APP_DB_PWD,
  database: process.env.REACT_APP_DB_NAME,
}
let knexDB;

//knex documentation
//http://knexjs.org/

const connectToDB = () => {
  knexDB = require('knex')({
    client: 'pg',
    connection: knex,
  });

  return knexDB;
};

module.exports.instance = () => {
  if (knexDB) {
    return knexDB;
  }

  return connectToDB();
};

