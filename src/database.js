const mysql = require('mysql');

/* const mysqlConnection = mysql.createConnection({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b0ab591da45cbb',
  password: 'bdbc7002',
  database: 'heroku_2205e3ccffad011',
  multipleStatements: true
}); */
const mysqlConnection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'sistema',
});
//mysql://b0ab591da45cbb:bdbc7002@eu-cdbr-west-03.cleardb.net/heroku_2205e3ccffad011?reconnect=true
mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});



module.exports = mysqlConnection;
