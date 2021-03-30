var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var GameInstanceSchema = new Schema(
  {
    game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    platform: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

GameInstanceSchema.virtual('url').get(function () {
  return '/catalog/gameinstance/' + this._id;
});

GameInstanceSchema.virtual('due_back_formatted').get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('GameInstanceSchema', GameInstanceSchema);