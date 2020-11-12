var express = require('express');
var router = express.Router();
var accountController = require('../controllers/accountController');

router.get('/Signin', accountController.sign_in_get );
router.post('/Signin', accountController.sign_in_post );

router.get('/Signup', accountController.sign_up_get );
router.post('/Signup', accountController.sign_up_post );

router.get('/Signout', accountController.sign_out_get );

module.exports = router;
