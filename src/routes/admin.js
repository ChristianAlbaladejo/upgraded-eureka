'use strict'
const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('../../services/jwt');
var jwtSimple = require('jwt-simple');
var md_auth = require('../../middlewares/authenticated');
var validator = require('validator');
var nodemailer = require('nodemailer');
var moment = require('moment');

const mysqlConnection = require('../mysql-con.js');
var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';


router.get('/admin/sales/:sord?', md_auth.ensureAuth, (req, res) => {
    if (req.params.sord != 'all') {
        mysqlConnection.query('SELECT * FROM salesorder order by id DESC LIMIT 5', (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
        });
    } else {
        mysqlConnection.query('SELECT * FROM salesorder order by id DESC', (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
        });
    }
});

router.get('/admin/salesFail', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query("SELECT * FROM salesorder where sended = 'false' order by id DESC", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/admin/getAllOrders', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query("SELECT salesorder.id, salesorder.orderLines, salesorder.grossAmount ,salesorder.userId, salesorder.deliverydate, salesorder.date, salesorder.orderNotes, salesorder.chargesType, salesorder.sended, user.name, user.lastname, user.email  FROM salesorder INNER JOIN user ON user.id=salesorder.userId order by id DESC ", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/admin/getAllOrdersShort', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query("SELECT salesorder.id, salesorder.orderLines, salesorder.grossAmount ,salesorder.userId, salesorder.deliverydate, salesorder.date, salesorder.orderNotes, salesorder.chargesType, salesorder.sended, user.name, user.lastname, user.email user.telefono  FROM salesorder INNER JOIN user ON user.id=salesorder.userId order by id DESC LIMIT 5", (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/admin/getchars/:id', md_auth.ensureAuth, (req, res) => {
    const { id } = req.params;
    mysqlConnection.query("SELECT count(*) from salesorder where month(deliverydate)= ?", [id], function (error, results, fields) {
        if (!error) {
            res.json(results);
        } else {
            console.log(error);
        }
    });
});

router.get('/admin/totalRevenue', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query('SELECT SUM(grossAmount) FROM salesorder', (err, rows, fields) => {
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
    mysqlConnection.query('SELECT COUNT(*) FROM salesorder', (err, rows, fields) => {
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
            rows[0]['password'] = undefined;
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

router.post('/admin/updateFamily/', md_auth.ensureAuth, (req, res) => {
    const family = req.body.family;
    let p = JSON.parse(family)
    for (let i = 0; i < p.length; i++) {
        mysqlConnection.query("UPDATE family set image ='" + p[i].image + "', name = '" + p[i].name +  "' WHERE id = '" + p[i].id + "'", function (error, results, fields) {
            console.log(error, results, fields);
        })
    }
    res.json(family);
});

router.post('/admin/deleteFamily/', md_auth.ensureAuth, (req, res) => {
    const family = req.body.family;
    let p = JSON.parse(family)
    for (let i = 0; i < p.length; i++) {
        mysqlConnection.query("DELETE FROM family  WHERE id = '" + p[i].id + "'", function (error, results, fields) {
            console.log(error, results, fields);
        })
    }
    res.json(family);
});

router.post('/admin/deleteProduct/', md_auth.ensureAuth, (req, res) => {
    const family = req.body.family;
    let p = JSON.parse(family)
    for (let i = 0; i < p.length; i++) {
        mysqlConnection.query("DELETE FROM product WHERE id = '" + p[i].id + "'", function (error, results, fields) {
            console.log(error, results, fields);
        })
    }
    res.json(family);
});

router.post('/admin/updateProducts/', md_auth.ensureAuth, (req, res) => {
    const products = req.body.products;
    let p = JSON.parse(products)
    for (let i = 0; i < p.length; i++) {
        mysqlConnection.query("UPDATE product set image ='" + p[i].image + "', costPrice = '" + p[i].costPrice + "', image = '" + p[i].image + "', familyId = '" + p[i].familyId + "', name = '" + p[i].name + "' WHERE id = '" + p[i].id + "'", function (error, results, fields) {
            console.log(error, results, fields);
        })
    }
    res.json(products);
});

router.post('/admin/newFamily/', md_auth.ensureAuth, (req, res) => {
    const family = req.body.family;
    let f = JSON.parse(family)
    console.log(f)
        mysqlConnection.query("INSERT INTO family (name, image) values ('" + f.name + "','" + f.image + "')", function (error, results, fields) {
            console.log(error, results, fields);
        })
    
    res.json(family);
});

router.post('/admin/newProduct/', md_auth.ensureAuth, (req, res) => {
    const products = req.body.products;
    let p = JSON.parse(products)
    for (let i = 0; i < p.length; i++) {
        mysqlConnection.query("INSERT INTO product (name, familyId, costPrice, image, quantity, description) values ('" + p[i].name + "'," + p[i].familyId + "," + p[i].costPrice + ", '" + p[i].image + "'," + p[i].quantity + ",'" + p[i].description + "'", function (error, results, fields) {
            console.log(error, results, fields);
        })
    }
    res.json(products);
});

router.get('/admin/getUsers/', md_auth.ensureAuth, (req, res) => {
    mysqlConnection.query("SELECT * FROM user", function (error, results, fields) {
        results[0]['password'] = undefined;
        res.json(results);
    })
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
                if (validator.isEmail(params.email)) {
                    bcrypt.hash(params.password, 10, function (err, hash) {
                        params.password = hash;
                        var sql = "INSERT INTO `user`(`name`,`lastname`,`password`,`CIF`,`calle`, `CP`, `poblacion`, `email`,`telefono`,`role`) VALUES ('" + params.name + "','" + params.lastname + "','" + params.password + "','" + params.CIF + "','" + params.calle + "','" + params.CP + "','" + params.poblacion + "','" + params.email + "','" + params.telefono + "','" + 'ADMIN' + "')";

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
                } else {
                    return res.status(500).send({ message: 'El email del usuario no es valido' });
                }
            }
        });
    } else {
        res.status(200).send({
            message: 'Envia todos los campos necesarios!!'
        });
    }
});










module.exports = router;