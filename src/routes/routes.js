'use strict'
const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('../../services/jwt');

const mysqlConnection = require('../database.js');

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


// INSERT a order
router.post('/order', (req, res) => {
  var post = req.body;
  console.log(req.body);
  mysqlConnection.query('INSERT INTO salesorder(orderLines, cashDiscount, grossAmount, surchargeRate, netAmount, vatAmount, surchargeAmount, sended) VALUES( ' + '"' + post.orderLines + '"' + ',' + '"' + post.cashDiscount + '"' + ',' + '"' + post.grossAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.netAmount + '"' + ',' + '"' + post.vatAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.sended + '"' + ');', (err, rows, fields) => {
    if (!err) {
      res.json({ status: 'order Saved' });
    } else {
      console.log(err);
    }
  });

});

router.post('/login', function (req, response) {
  var params = req.body;
  var email = req.body.email;
  var password = req.body.password;

  if (email && password) {
    mysqlConnection.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
      console.log(password, results[0]['password']);

      bcrypt.compare(password, results[0]['password'], (err, check) => {
        if (check) {
          console.log(check);
          if (params.gettoken) {
            //generar y devolver token
            results[0]['password'] = undefined;
            return response.status(200).send({
              token: jwt.createToken(results[0]['id']),
              user: results
            });
          }
        } else {
          return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
        }
      });
    });
    
  } else {
    return res.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
    
  }

});

router.post('/register', function (req, res) {
  var params = req.body;
  if (params.name && params.lastname && params.password && params.CIF && params.calle && params.CP && params.poblacion && params.email) {
    // Controlar usuarios duplicados
    var sql = "SELECT * FROM `user` WHERE `email`='" + params.email + "'";
    console.log(req.body);
    mysqlConnection.query(sql, function (err, results) {
      console.log(results);
      if (results.length) {
        res.status(200).send({
          message: 'El usuario ya existe!!'
        });
      }
      else {
        bcrypt.hash(params.password, 10, function (err, hash) {
          params.password = hash;
          console.log(params.password, hash);
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

function comparePass(pass, hash) {
  return bcrypt.compare(pass, hash);
}



module.exports = router;
