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

/**
* @swagger
* /:
*  get:
*    description: Retorna todas las familias
*    responses:
*      '200':
*        description:  Ok
*/
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
/**
* @swagger
* /products/:families:
*  get:
*    description: Retorna todas los productos ordenados por su familia
*    responses:
*      '200':
*        description:  Ok
*/
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

/**
* @swagger
* /products:
*  get:
*    description: Retorna todas los productos
*    responses:
*      '200':
*        description:  Ok
*/
router.get('/products', (req, res) => {
  mysqlConnection.query('SELECT * FROM product', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

/**
* @swagger
* /products/:id:
*  get:
*    description: Retorna un producto introduciendole su id
*    responses:
*      '200':
*        description:  Ok
*/
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

/**
* @swagger
* /familiName/:id:
*  get:
*    description: Retorna el nombre de la familia por id
*    responses:
*      '200':
*        description:  Ok
*/
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

/**
* @swagger
* /order:
*    post:
*      summary: "Order"
*      description: "Hacer un pedido"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto para registrar un nuevo orden"
*        required: true
*        schema:
*          $ref: "#/definitions/order"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  order:
*    type: "object"
*    properties:
*      orderLines:
*        type: "string"
*        format: "orderLines"
*      cashDiscount:
*        type: "string"
*        format: "cashDiscount"
*      grossAmount:
*        type: "string"
*        format: "grossAmount"
*      surchargeRate:
*        type: "string"
*        format: "surchargeRate"
*      netAmount:
*        type: "string"
*        description: "netAmount"
*      vatAmount:
*        type: "string"
*        description: "vatAmount"
*      surchargeAmount:
*        type: "string"
*        description: "surchargeAmount"
*      sended:
*        type: "string"
*        description: "sended"
*      email:
*        type: "string"
*        description: "email"
*      deliveryDate:
*        type: "string"
*        description: "deliveryDate"
*      orderNotes:
*        type: "string"
*        description: "orderNotes"
*      chargesType:
*        type: "string"
*        description: "chargesType"
*    json:
*      name: "Login"
*/
router.post('/order', md_auth.ensureAuth, (req, res) => {
  var fechaEnMiliseg = new Date().toISOString()
  console.log(fechaEnMiliseg)
  if (req.body) {
    var post = req.body;
    console.log(req.body);
    mysqlConnection.query('INSERT INTO salesorder(orderLines, cashDiscount, grossAmount, surchargeRate, netAmount, vatAmount, surchargeAmount, userId ,sended,date,chargesType,deliverydate, orderNotes) VALUES( ' + '"' + post.orderLines + '"' + ',' + '"' + post.cashDiscount + '"' + ',' + '"' + post.grossAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.netAmount + '"' + ',' + '"' + post.vatAmount + '"' + ',' + '"' + post.surchargeAmount + '"' + ',' + '"' + post.userId + '"' + ',' + '"' + post.sended + '"' + ',' + '"' + fechaEnMiliseg + '"' + ',' + '"' + post.chargesType + '"' + ',' + '"' + post.deliveryDate + '"' + ',' + '"' + post.orderNotes + '"' + ');', (err, rows, fields) => {
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

/**
* @swagger
* /login:
*    post:
*      summary: "Log-in"
*      description: "Log-in de un usuario ya registrado"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto de un usuario para el log-in"
*        required: true
*        schema:
*          $ref: "#/definitions/login"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  login:
*    type: "object"
*    properties:
*      name:
*        type: "string"
*        format: "name"
*      lastname:
*        type: "string"
*        format: "LastName"
*      password:
*        type: "string"
*        format: "Password"
*      CIF:
*        type: "string"
*        format: "CIF"
*      calle:
*        type: "string"
*        description: "calle"
*      CP:
*        type: "string"
*        description: "CP"
*      poblacion:
*        type: "string"
*        description: "poblacion"
*      email:
*        type: "string"
*        description: "email"
*      telefono:
*        type: "string"
*        description: "telefono"
*    json:
*      name: "Login"
*/
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
      if (results.length != 0 && results[0]['role'] == 'CUSTOMER') {
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
      } else {
        return response.status(404).send({ message: 'El usuario no existe' });
      }
    });
  } else {
    return response.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
  }
});

/**
* @swagger
* /register:
*    post:
*      summary: "Register"
*      description: "Registro de un usuario ya registrado"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto de un usuario para el registro"
*        required: true
*        schema:
*          $ref: "#/definitions/login"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  login:
*    type: "object"
*    properties:
*      name:
*        type: "string"
*        format: "name"
*      lastname:
*        type: "string"
*        format: "LastName"
*      password:
*        type: "string"
*        format: "Password"
*      CIF:
*        type: "string"
*        format: "CIF"
*      calle:
*        type: "string"
*        description: "calle"
*      CP:
*        type: "string"
*        description: "CP"
*      poblacion:
*        type: "string"
*        description: "poblacion"
*      email:
*        type: "string"
*        description: "email"
*      telefono:
*        type: "string"
*        description: "telefono"
*    json:
*      name: "Login"
*/
router.post('/register', function (req, res) {
  var params = req.body;
  if (params.name && params.lastname && params.password && params.CIF && params.calle && params.CP && params.telefono && params.poblacion && params.email) {
    // Controlar usuarios duplicados
    var sql = "SELECT * FROM `customer` WHERE `email`='" + params.email + "'";
    mysqlConnection.query(sql, function (err, results) {
      if (results.length) {
        res.status(200).send({
          message: 'El usuario ya existe!!'
        });
      }
      else {
        bcrypt.hash(params.password, 10, function (err, hash) {
          params.password = hash;
          var sql = "INSERT INTO `user`(`name`,`lastname`,`password`,`CIF`,`calle`, `CP`, `poblacion`, `email`,`telefono`,`role`) VALUES ('" + params.name + "','" + params.lastname + "','" + params.password + "','" + params.CIF + "','" + params.calle + "','" + params.CP + "','" + params.poblacion + "','" + params.email + "','" + params.telefono + "','" + 'CUSTOMER' + "')";

          mysqlConnection.query(sql, function (err, result) {
            if (!err) {
              res.status(200).send({
                message: 'Registrado'
              });
            } else {
              res.status(500).send({
                message: err
              });
            }
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

/**
* @swagger
* /lastOrder:
*  get:
*    description: Obtener el ultimo order que se ha realizado para saber cual poner al insertar el nuevo orden que se realice
*    responses:
*      '200':
*        description:  Ok
*/
router.get('/lastOrder', (req, res) => {
  mysqlConnection.query('SELECT MAX(id) FROM salesorder;', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

/**
* @swagger
* /lastCustomer:
*  get:
*    description: Obtener el ultimo cliente que se ha realizado para saber cual poner al insertar el nuevo cliente que se realice
*    responses:
*      '200':
*        description:  Ok
*/
router.get('/lastCustomer', (req, res) => {
  mysqlConnection.query('SELECT MAX(id) FROM customer;', (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

/**
* @swagger
* /addFavorite:
*    post:
*      summary: "Añadir a favoritos"
*      description: "Añadir un producto a la lista de favoritos"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto de un usuario para el log-in"
*        required: true
*        schema:
*          $ref: "#/definitions/fav"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  fav:
*    type: "object"
*    properties:
*      productId:
*        type: "integer"
*        format: "int64"
*      userId:
*        type: "integer"
*        format: "int64"
*    json:
*      name: "fav"
*/
router.post('/addFavorite', (req, res) => {
  var params = req.body;
  console.log(params)
  mysqlConnection.query("INSERT INTO `favorite`(`productId`,`userId`) VALUES (" + params.productId + "," + params.userId + ");", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

/**
* @swagger
* /removeFavorite/:productId/:userId:
*  delete:
*    description: Eliminar un producto de la lista de favoritos
*    responses:
*      '200':
*        description:  Ok
*/
router.delete('/removeFavorite/:productId/:userId', (req, res) => {
  var params = req.params;
  mysqlConnection.query("DELETE FROM `favorite` WHERE productId = " + params.productId + " AND userId= " + params.userId + ";", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

/**
* @swagger
* /getFavorites/:userId:
*  get:
*    description: Retorna todos los productos del usuario que se le pase y que esten en la tabla de favoritos
*    responses:
*      '200':
*        description:  Ok
*/
router.get('/getFavorites/:userId', (req, res) => {
  var params = req.params;
  mysqlConnection.query("SELECT * FROM `favorite` INNER JOIN product ON favorite.productId = product.id WHERE `userId` = " + params.userId + ";", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

/**
* @swagger
* /checkFavorite/:productId/:userId:
*  get:
*    description: Endpoint para comprobar si un producto existe en la tabla de favoritos
*    responses:
*      '200':
*        description:  Ok
*/
router.get('/checkFavorite/:productId/:userId', (req, res) => {
  var params = req.params;
  mysqlConnection.query("SELECT * FROM `favorite` INNER JOIN product ON favorite.productId = product.id WHERE `userId` = " + params.userId + " AND `productId` = "+params.productId+";", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

/**
* @swagger
* /filter/:filter?:
*  get:
*    description: filtro para productos
*    responses:
*      '200':
*        description:  Ok
*/
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

/**
* @swagger
* /filterByName/:filter?/:family?:
*  get:
*    description: filtro para familias
*    responses:
*      '200':
*        description:  Ok
*/
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

/**
* @swagger
* /charge:
*    post:
*      summary: "Pagos por tarjeta de credito"
*      description: "Añadir un pago por tarjeta de credito mediante stripe"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto de un usuario para el log-in"
*        required: true
*        schema:
*          $ref: "#/definitions/stripe"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  stripe:
*    type: "object"
*    properties:
*      stripeToken:
*        type: "string"
*        format: "Token Stripe"
*      amount:
*        type: "string"
*        format: "amount * 100"
*    json:
*      name: "stripe"
*/
router.post('/charge', function (req, res) {
  const stripe = require("stripe")("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");
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

/**
* @swagger
* /salesorders/:id:
*  get:
*    description: Retorna todos los pedidos realizados por el usuaruio
*    responses:
*      '200':
*        description:  Ok
*/
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

/**
* @swagger
* /forgotpassword:
*  get:
*    description: Recuperar contraseña de usuarios
*    responses:
*      '200':
*        description:  Ok
*/
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

/**
* @swagger
* /admin/sales/:sord?:
*  get:
*    description: Devuelve los primeros pedidos realizados en la tienda 
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/salesFail:
*  get:
*    description: Devuelve los pedidos fallidos que se han realizado en la tienda
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/getAllOrders:
*  get:
*    description: Devuelve todos los pedidos que se han realizado en la tienda
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/getAllOrdersShort:
*  get:
*    description: Devuelve todos los pedidos que se han realizado en la tienda limitados a los 5 primeros
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/getchars/:id':
*  get:
*    description: Datos pata rellenar las gráficas
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/totalRevenue:
*  get:
*    description: Total ganado 
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/totalUser:
*  get:
*    description: Total de usuarios
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/totalSales:
*  get:
*    description: Numero de ventas realizadas en total
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/returnUser/:id:
*  get:
*    description: Retorna el usuario que tena ese id
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/updateOrder/:order:
*  put:
*    description: Actualiza el estado de un pedido realizado 
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/updateProducts:
*    post:
*      summary: "Actualizar un producto"
*      description: "Actualizar un producto fallido"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto de un usuario para el log-in"
*        required: true
*        schema:
*          $ref: "#/definitions/updateProducts"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  updateProducts:
*    type: "object"
*    properties:
*      products:
*        type: "string"
*        format: "carrito"
*    json:
*      name: "updateProducts"
*/

/**
* @swagger
* /admin/getUsers:
*  get:
*    description: Retorna el listado de usuarios
*    responses:
*      '200':
*        description:  Ok
*/

/**
* @swagger
* /admin/login:
*    post:
*      summary: "Log-in"
*      description: "Log-in de un usuario ya registrado"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto de un usuario para el log-in"
*        required: true
*        schema:
*          $ref: "#/definitions/login"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  login:
*    type: "object"
*    properties:
*      name:
*        type: "string"
*        format: "name"
*      lastname:
*        type: "string"
*        format: "LastName"
*      password:
*        type: "string"
*        format: "Password"
*      CIF:
*        type: "string"
*        format: "CIF"
*      calle:
*        type: "string"
*        description: "calle"
*      CP:
*        type: "string"
*        description: "CP"
*      poblacion:
*        type: "string"
*        description: "poblacion"
*      email:
*        type: "string"
*        description: "email"
*      telefono:
*        type: "string"
*        description: "telefono"
*    json:
*      name: "Login"
*/

/**
* @swagger
* /admin/register:
*    post:
*      summary: "Register"
*      description: "Registro de un usuario ya registrado"
*      operationId: ""
*      consumes:
*      - "application/json"
*      produces:
*      - "application/xml"
*      - "application/json"
*      parameters:
*      - in: "body"
*        name: "body"
*        description: "objeto de un usuario para el registro"
*        required: true
*        schema:
*          $ref: "#/definitions/login"
*      responses:
*        "405":
*          description: "Invalid input"
* definitions:
*  login:
*    type: "object"
*    properties:
*      name:
*        type: "string"
*        format: "name"
*      lastname:
*        type: "string"
*        format: "LastName"
*      password:
*        type: "string"
*        format: "Password"
*      CIF:
*        type: "string"
*        format: "CIF"
*      calle:
*        type: "string"
*        description: "calle"
*      CP:
*        type: "string"
*        description: "CP"
*      poblacion:
*        type: "string"
*        description: "poblacion"
*      email:
*        type: "string"
*        description: "email"
*      telefono:
*        type: "string"
*        description: "telefono"
*    json:
*      name: "Login"
*/

module.exports = router;
