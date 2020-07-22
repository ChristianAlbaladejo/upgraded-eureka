'use strict'
const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('../../services/jwt');
var md_auth = require('../../middlewares/authenticated');

const mysqlConnection = mysql.createPool({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b0ab591da45cbb',
  password: 'bdbc7002',
  database: 'heroku_2205e3ccffad011',
});

// GET all families
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM family', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// filteriring families 
router.get('/products/:families', (req, res) => {
  const { families } = req.params;
  mysqlConnection.query('SELECT * FROM product WHERE familyId = ?', [families], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});
router.get('/products', (req, res) => {
  mysqlConnection.query('SELECT * FROM product', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('/product', (req, res) => {
  const { id } = req.params.id;
  mysqlConnection.query('SELECT * FROM product WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('/familiName/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('SELECT name FROM family WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});


// INSERT a order
router.post('/order',md_auth.ensureAuthç ,(req, res) => {
  if (req.body) {
  var post = req.body;
  console.log(req.body);
  mysqlConnection.query('INSERT INTO salesorder(orderLines, cashDiscount, grossAmount, surchargeRate, netAmount, vatAmount, surchargeAmount, sended) VALUES( ' + '"' + post.orderLines + '"' + ',' + '"' + post.cashDiscount + '"' + ',' + '"' + post.grossAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.netAmount + '"' + ',' + '"' + post.vatAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.sended + '"' + ');', (err, rows, fields) => {
    if (!err) {
      res.json({ status: 'order Saved' });
    } else {
      console.log(err);
    }
  });
  }
});

router.post('/login', function (req, response) {
  if (req.body) {
    var params = req.body;
    console.log(params);
    var email = req.body.email;
    var password = req.body.password;
  }
  if (email && password) {
    console.log(password);
    mysqlConnection.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
      console.log(password, results[0]['password']);
      bcrypt.compare(password, results[0]['password'], (err, check) => {
        if (check) {
            //generar y devolver token
            results[0]['password'] = undefined;
            return response.status(200).send({
              token: jwt.createToken(results[0]['id']),
              user: results
            });
          
        } else {
          return response.status(404).send({ message: 'El usuario no se ha podido identificar' });
        }
      });
    });
  } else {
    return response.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
  }
});

router.post('/register', function (req, res) {
  var params = req.body;
  if (params.name && params.lastname && params.password && params.CIF && params.calle && params.CP && params.poblacion && params.email) {
    // Controlar usuarios duplicados
    var sql = "SELECT * FROM `user` WHERE `email`='" + params.email + "'";
    mysqlConnection.query(sql, function (err, results) {
      if (results.length) {
        res.status(200).send({
          message: 'El usuario ya existe!!'
        });
      }
      else {
        console.log('hola')
        bcrypt.hash(params.password, 10, function (err, hash) {
          params.password = hash;
          var sql = "INSERT INTO `user`(`name`,`lastname`,`password`,`CIF`,`calle`, `CP`, `poblacion`, `email`) VALUES ('" + params.name + "','" + params.lastname + "','" + params.password + "','" + params.CIF + "','" + params.calle + "','" + params.CP + "','" + params.poblacion + "','" + params.email + "')";

          mysqlConnection.query(sql, function (err, result) {
            res.status(200).send({
              message: 'Registrado'
            });
          });
        });
      }
    });
  } else {
    res.status(200).send({
      message: 'Envia todos los campos necesarios!!'
    });
  }
});


router.get('/lastOrder', (req, res) => {
  mysqlConnection.query('SELECT MAX(id) FROM salesorder;', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});



module.exports = router;
