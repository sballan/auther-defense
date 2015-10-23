'use strict';

var router = require('express').Router();
var crypto = require('crypto');

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

router.post('/login', function(req, res, next) {
	var email = req.body.email
	var password = req.body.password
	console.log('----------This is the initial password:', password)

	User.findOne({email: email}).exec()
	.then(function(user) {
		if (!user) throw HttpError(401);
		else {
			console.log("----------User :", user)
			crypto.pbkdf2(password, user.salt, 32, 1024, function(err, key) {
				if (err) return next(err)
				if (user.password == key) {
					console.log("----------We had the right password hash ")
						req.login(user, function() {
								res.json(user);
						});
				} else {
						throw HttpError(401)
				}
			})
		}
	});
})


router.post('/signup', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	console.dir(req.user)
	res.json(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;