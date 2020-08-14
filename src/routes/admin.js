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



router.get('/admin/sales/:sord?', md_auth.ensureAuth, (req, res) => {
    console.log(req.params)
    if (req.params.sord != 'all') {
        mysqlConnection.query('SELECT * FROM salesOrder order by id DESC LIMIT 5', (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
        });
    }else{
    mysqlConnection.query('SELECT * FROM salesOrder order by id DESC', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}
});

router.get('/admin/salesFail', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query("SELECT * FROM salesOrder where sended = 'false'", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/admin/totalRevenue', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query('SELECT SUM(grossAmount) FROM salesOrder', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/admin/totalUser', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query('SELECT COUNT(*) FROM user', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/admin/totalSales', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query('SELECT COUNT(*) FROM salesOrder', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/admin/returnUser/:id', md_auth.ensureAuth, (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM user WHERE id = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.put('/admin/updateOrder/:order', md_auth.ensureAuth, (req, res) => {
    const { order } = req.params;
    mysqlConnection.query("UPDATE salesorder set sended = 'true' WHERE id=?", [order], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/admin/updateProducts/', md_auth.ensureAuth, (req, res) => {
    const  products  = req.body.products;
   let  p = JSON.parse(products)
    mysqlConnection.query("TRUNCATE TABLE product;");
   for (let i = 0; i < p.length; i++) {
       mysqlConnection.query("INSERT INTO product (id, name, baseSaleFormatId, buttonText, color, PLU, familyId, vatId,useAsDirectSale,saleableAsMain,saleableAsAddin,isSoldByWeight,askForPreparationNotes,askForAddins,printWhenPriceIsZero,preparationTypeId,preparationOrderId,costPrice,image,quantity,notes,active) VALUES ('" + p[i].id + "','" + p[i].name + "','" + p[i].baseSaleFormatId + "','" + p[i].buttonText + "','" + p[i].color + "','" + p[i].PLU + "','" + p[i].familyId + "','" + p[i].vatId + "','" + p[i].useAsDirectSale + "','" + p[i].saleableAsMain + "','" + p[i].saleableAsAddin + "','" + p[i].isSoldByWeight + "','" + p[i].askForPreparationNotes + "','" + p[i].askForAddins + "','" + p[i].printWhenPriceIsZero + "','" + p[i].preparationTypeId + "','" + p[i].preparationOrderId + "','" + p[i].costPrice + "','" + p[i].image + "','" + p[i].quantity + "','" + p[i].notes + "','" + p[i].active + "');", function (error, results, fields) {
           console.log(error);
       })
   }
    res.json(products);
    /* mysqlConnection.query("truncate customer;") */
    /* mysqlConnection.query("UPDATE salesorder set sended = 'true' WHERE id=?", [order], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    }); */
});

router.post('/admin/login', function (req, response) {
    if (req.body) {
        var params = req.body;
        var email = req.body.email;
        var password = req.body.password;
    }
    if (email && password) {
        console.log(email);
        mysqlConnection.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
            console.log(results);
            if (results.length != 0 && results[0]['role'] == 'ADMIN') {
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

router.post('/admin/register', function (req, res) {
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
                    var sql = "INSERT INTO `user`(`name`,`lastname`,`password`,`CIF`,`calle`, `CP`, `poblacion`, `email`,`telefono`,`role`) VALUES ('" + params.name + "','" + params.lastname + "','" + params.password + "','" + params.CIF + "','" + params.calle + "','" + params.CP + "','" + params.poblacion + "','" + params.email + "','" + params.telefono + "','" + 'ADMIN' + "')";

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










module.exports = router;