var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  if( this.date_of_birth ){
    var dateOfBirthString = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
  }else{
    var dateOfBirthString = "Unknown";
  }
  if( this.date_of_death ){
      var dateOfDeathString = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
  }else{
      var dateOfDeathString = "";
  }
  return dateOfBirthString + " - " + dateOfDeathString;
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);