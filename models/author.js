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

// Virtual for setting html input type=date
AuthorSchema
  .virtual('date_of_birth_html')
  .get( function(){
    if( this.date_of_birth ){
      var dateOfBirth = this.date_of_birth;
      var year = dateOfBirth.getFullYear() + "";
      var day = "" + dateOfBirth.getDate();
      var mon = "" + (dateOfBirth.getMonth() + 1);
      return year + "-" + day.padStart(2, "0") + "-" + mon.padStart(2, "0");
    }else{
      return "";
    }
  } );


// Virtual for setting html input type=date
AuthorSchema
  .virtual('date_of_death_html')
  .get( function(){
    if( this.date_of_death ){
      var dateOfdeath = this.date_of_death;
      var year = dateOfdeath.getFullYear() + "";
      var day = "" + dateOfdeath.getDate();
      var mon = "" + (dateOfdeath.getMonth() + 1);
      return year + "-" + day.padStart(2, "0") + "-" + mon.padStart(2, "0");
    }else{
      return "";
    }
  } );

//Export model
module.exports = mongoose.model('Author', AuthorSchema);