var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema
.virtual('due_back_formatted')
.get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});


// Virtual for setting html input type=date
BookInstanceSchema
  .virtual('due_back_html')
  .get( function(){
    if( this.due_back ){
      var due_back = this.due_back;
      var year = due_back.getFullYear() + "";
      var day = "" + due_back.getDate();
      var mon = "" + (due_back.getMonth() + 1);
      return year + "-" + mon.padStart(2, "0") + "-" + day.padStart(2, "0");
    }else{
      return "";
    }
  } );

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);