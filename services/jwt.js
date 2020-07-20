'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ClaveSecreta';

exports.createToken = function(user){
	var payload = {
		sub: user,
		iat: moment().unix(),
		exp: moment().add(360, 'days').unix
	};

	return jwt.encode(payload, secret);
};