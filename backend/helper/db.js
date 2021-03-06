var mysql      = require('mysql');
// console.log(process.env);
var connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  port     : process.env.MYSQL_PORT,
  user     : process.env.MYSQL_USERNAME,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    connect = connection;
    console.log('connected as id ' + connection.threadId);
});

// console.log(connection);
module.exports = connection;