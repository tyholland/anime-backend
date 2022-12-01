const { knex } = require('../config');
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

