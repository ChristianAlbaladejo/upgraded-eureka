/* 'use strict'
const mysql = require('mysql');
 */
/*  const mysqlConnection = mysql.createConnection({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b0ab591da45cbb',
  password: 'bdbc7002',
  database: 'heroku_2205e3ccffad011',
  multipleStatements: true
});  */
/* const mysqlConnection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'sistema',
}); */
//mysql://b0ab591da45cbb:bdbc7002@eu-cdbr-west-03.cleardb.net/heroku_2205e3ccffad011?reconnect=true
/* mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
}); */
'use strict';
/* var mysql = require('mysql');
const connection = mysql.createPool({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b0ab591da45cbb',
  password: 'bdbc7002',
  database: 'heroku_2205e3ccffad011',
});

connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log('Connected!:)');
  }
});
 */

var db_config = {
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b0ab591da45cbb',
  password: 'bdbc7002',
  database: 'heroku_2205e3ccffad011',
};

var connection;

function handleDisconnect() {
  console.log('1. connecting to db:');
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {              	// The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('2. error when connecting to db:', err);
      setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
    }                                     	// to avoid a hot loop, and to allow our node script to
  });                                     	// process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('3. db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
      handleDisconnect();                      	// lost due to either server restart, or a
    } else {                                      	// connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
module.exports = connection;
