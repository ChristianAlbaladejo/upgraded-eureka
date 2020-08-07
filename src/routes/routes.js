'use strict'
const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('../../services/jwt');
var jwtSimple = require('jwt-simple');
var md_auth = require('../../middlewares/authenticated');
var nodemailer = require('nodemailer');
var moment = require('moment');

const mysqlConnection = require('../mysql-con.js');
var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
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

router.get('/product/:id', (req, res) => {
  const { id } = req.params;
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
router.post('/order', md_auth.ensureAuth, (req, res) => {
  let now = new Date.now();
  if (req.body) {
    var post = req.body;
    console.log(req.body);
    mysqlConnection.query('INSERT INTO salesorder(orderLines, cashDiscount, grossAmount, surchargeRate, netAmount, vatAmount, surchargeAmount, userId ,sended,date) VALUES( ' + '"' + post.orderLines + '"' + ',' + '"' + post.cashDiscount + '"' + ',' + '"' + post.grossAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.netAmount + '"' + ',' + '"' + post.vatAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.userId + '"' + ',' + '"' + post.sended + '"' + ',' + '"' + now + '"' + ');', (err, rows, fields) => {
      if (!err) {
        res.json({ status: 'order Saved' });
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'pruebasdecosasparamiscosas@gmail.com',
            pass: 'Blade001$'
          }
        });

        const mailOptions = {
          from: 'pruebasdecosasparamiscosas@gmail.com', // sender address
          to: req.body.email, // list of receivers
          subject: 'Subject of your email', // Subject line
          text: 'Muchas gracias por hacer tu pedido en Panes&Co'// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err)
            console.log(err)
          else
            console.log(info);
        });
      } else {
        console.log(err);
      }
    });
  }
});

router.post('/login', function (req, response) {
  if (req.body) {
    var params = req.body;
    var email = req.body.email;
    var password = req.body.password;
  }
  if (email && password) {
    console.log(email);
    mysqlConnection.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
      console.log(results);
      if (results.length != 0) {
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
      }else{
        return response.status(404).send({ message: 'El usuario no existe' });
      }
    });
  } else {
    return response.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
  }
});

router.post('/register', function (req, res) {
  var params = req.body;
  if (params.name && params.lastname && params.password && params.CIF && params.calle && params.CP && params.telefono && params.poblacion && params.email) {
    // Controlar usuarios duplicados
    var sql = "SELECT * FROM `user` WHERE `email`='" + params.email + "'";
    mysqlConnection.query(sql, function (err, results) {
      if (results.length) {
        res.status(200).send({
          message: 'El usuario ya existe!!'
        });
      }
      else {
        bcrypt.hash(params.password, 10, function (err, hash) {
          params.password = hash;
          var sql = "INSERT INTO `user`(`name`,`lastname`,`password`,`CIF`,`calle`, `CP`, `poblacion`, `email`,`telefono`) VALUES ('" + params.name + "','" + params.lastname + "','" + params.password + "','" + params.CIF + "','" + params.calle + "','" + params.CP + "','" + params.poblacion + "','" + params.email + "','" + params.telefono + "')";

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

//filter search
router.get('/filter/:filter?', (req, res) => {
  let filter
  if (req.params.filter) {
    filter = req.params.filter
  } else {
    filter = ''
  }
  mysqlConnection.query('SELECT * FROM family INNER JOIN product ON family.id = product.familyId where family.name like ' + "'" + filter + "%'" + ' or product.name like ' + "'" + filter + "%'" + ' ;', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//filter search by product name
router.get('/filterByName/:filter?/:family?', (req, res) => {
  let filter
  let family
  if (req.params.filter) {
    filter = req.params.filter
    family = req.params.family
  } else {
    filter = ''
    family = ''
  }
  mysqlConnection.query('SELECT * FROM family INNER JOIN product ON family.id = product.familyId where family.id like ' + "'" + family + "'" + ' and product.name like ' + "'" + filter + "%'" + ' ;', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});
router.post('/charge', function (req, res) {
  const stripe = require("stripe")("sk_test_51H9oTAATbeiMfoWZrwcnxrpBAUJmjlir7GHsrp1zNH3BVDxFuvH6iDf2SZNaaP1wNVcBn291PNT2bb1pYuCqsGk700JUfLsoaM");
  const stripToken = req.body.stripeToken;
  const amount = req.body.amount
  stripe.charges.create(
    {
      amount: amount,
      currency: 'eur',
      source: stripToken,
      description: 'My First Test Charge (created for API docs)',
    },
    function (err, charge) {
      console.log(charge)
      if (err) {
        res.send({
          success: false,
          message: 'ERrorr'
        });
      } else {
        res.send({
          success: true,
          message: 'Success'
        })
      }
    }
  );
});

router.get('/salesorders/:id', md_auth.ensureAuth, (req, res) => {
  let id
  if (req.params.id) {
    id = req.params.id
  } else {
    id = '';
  }
  mysqlConnection.query('SELECT * FROM salesorder where salesorder.userId =' + "'" + id + "'" + ' ;', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get('/forgotpassword', function (req, res) {
  res.send('<form action="/passwordreset" method="POST">' +
    '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
    '<input type="submit" value="Reset Password" />' +
    '</form>');
});

router.post('/passwordreset', function (req, res) {
  if (req.body.email !== undefined) {
    var emailAddress = req.body.email;
    mysqlConnection.query('SELECT * FROM user WHERE email = ?', [emailAddress], (err, rows, fields) => {
      if (!err && rows != 0) {
        const user = rows;
        console.log(user[0]['id'])

        var payload = {
          id: user[0]['id'],        // User ID from database
          email: emailAddress
        };

        // TODO: Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + ‘-' + user.created.getTime();
        var token = jwtSimple.encode(payload, secret);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'pruebasdecosasparamiscosas@gmail.com',
            pass: 'Blade001$'
          }
        });

        const mailOptions = {
          from: 'pruebasdecosasparamiscosas@gmail.com', // sender address
          to: payload.email, // list of receivers
          subject: 'Subject of your email', // Subject line
          html: '<a href="https://panesandco.herokuapp.com/resetpassword/' + payload.id + '/' + token + '" > Reset password</a>'// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err)
            console.log(err)
          else
            console.log(info);
        });
        // if you don't want to use this transport object anymore, uncomment following line
        //transport.close();

        // TODO: Send email containing link to reset password.
        // In our case, will just return a link to click.
        res.send('Se ha enviado un correo a: ' + user[0]['email']);
      } else {
        res.send('<form action="/passwordreset" method="POST">' +
          '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
          '<input type="submit" value="Reset Password" />' +
          '<h1>El usuario no existe</h1>' +
          '</form>');
      }
    });
  } else {
    res.send('Email address is missing.');
  }
});

router.get('/resetpassword/:id/:token', function (req, res) {
  // TODO: Fetch user from database using
  // req.params.id
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combine it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();
  var payload = jwtSimple.decode(req.params.token, secret);

  // TODO: Gracefully handle decoding issues.
  // Create form to reset password.
  res.send('<form action="/resetpassword" method="POST">' +
    '<input type="hidden" name="id" value="' + payload.id + '" />' +
    '<input type="hidden" name="token" value="' + req.params.token + '" />' +
    '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
    '<input type="submit" value="Reset Password" />' +
    '</form>');
});

router.post('/resetpassword', function (req, res) {
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combining it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();
  var user;
  try {
    var payload = jwtSimple.decode(req.body.token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        message: 'El token ha expirado'
      });
    }
  } catch (ex) {
    return res.status(404).send({
      message: 'El token no es válido'
    });
  }

  mysqlConnection.query('SELECT * FROM user WHERE id = ?', [req.body.id], (err, rows, fields) => {
    if (!err && rows != 0) {
      user = rows;
    }
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      req.body.password = hash;
      var sql = 'UPDATE user SET password = ' + "'" + req.body.password + "'" + ' WHERE id = ' + "'" + user[0]['id'] + "'" + ';'
      console.log(sql)
      mysqlConnection.query(sql, function (err, result) {

      });
    });
  });
  res.send('Your password has been successfully changed.');
});

module.exports = router;
