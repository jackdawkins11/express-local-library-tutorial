var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/*
  Define the Account database schema.
*/
var AccountSchema = new Schema(
  {
    username: {type: String, required: true, minlength: 3, maxlength: 20},
    password: {type: String, required: true, minlength: 3, maxlength: 20},
  }
);

//Export model
module.exports = mongoose.model('Account', AccountSchema);