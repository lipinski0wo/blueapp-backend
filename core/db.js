const mysql = require('mysql');
const { dbConfig } = require('../settings');

exports.executeSql = (sql, callback) => {
  const connection = mysql.createConnection(dbConfig);

  connection.connect();

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return callback(null, error);
    }
    callback(results, null);
  });

  connection.end();
};
