var Account = require("../models/Account");
var async = require("async");
const { body, validationResult } = require('express-validator');

exports.sign_in_get = function (req, res, next) {
    res.render('sign_in');
};

exports.sign_in_post = function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.render('sign_in');
    }
    async.parallel({
        user_count: function (callback) {
            Account.countDocuments({ username: username, password: password }, callback);
        }
    }, function (error, results) {
        if (error) {
            res.render('sign_in', { username: username, errors: [{ msg: "There was an error." }] });
        } else {
            if (results.user_count == 1) {
                //req.session.username = username;
                res.send('You are signed in');
            } else {
                res.render('sign_in', { username: username, errors: [{ msg: "Couldn't find an account associated with that username and password" }] });
            }
        }
    });

}

exports.sign_up_get = function (req, res, next) {
    res.render('sign_up');
};

exports.sign_up_post = [
    body('username', 'username must be 3-20 characters.').trim().isLength({ min: 3, max: 20 }),
    body('password', 'password must be 3-20 characters.').trim().isLength({ min: 3, max: 20 }),
    body('password', 'password must contain lowercase letter.').trim().matches(/.*[a-z].*/, "i"),
    body('password', 'password must contain uppercase letter.').trim().matches(/.*[A-Z].*/, "i"),
    body('password', 'password must contain digit.').trim().matches(/.*[0-9].*/, "i"),
    body('password', 'password must contain special character.').trim().matches(/.*[!@#$%^&*()].*/, "i"),
    function (req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        const errors = validationResult(req);
        if( !errors.isEmpty() ){
            res.render('sign_up', { username: username, errors: errors.array() });
            return;
        }
        if (password !== req.body.password_confirm) {
            res.render('sign_up', { username: username, errors: [{msg: "Passwords must match"}] });
            return;
        }
        async.waterfall([
            function (callback) {
                Account.countDocuments({ username: username }, function (err, count) {
                    callback(err, count);
                });
            },
            function (count, callback) {
                if (0 < count) {
                    callback(null, true);
                    return;
                }
                var user = new Account({
                    username: username,
                    password: password
                });
                user.save(function (err) {
                    callback(err, false);
                });
            }
        ], function (err, userExists ) {
            if(err){
                res.render('sign_up', { username: username, errors: [{ msg: "There was an error." }] });
            }else{
                if( userExists ){
                    res.render('sign_up', { username: username, errors: [{ msg: "That username is taken." }] });
                }else{
                    res.render('sign_in', { username: username });
                }
            }
        });

    }
];