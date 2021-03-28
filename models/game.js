var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema({
    name: {type: String, required: true},
    developer: {type: Schema.Types.ObjectId, ref:'Developer', required: true},
    summary: {type: String, required: true},
    imgUrl: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
});

GameSchema.virtual('url').get(function(){
    return '/catalog/game/' + this._id;
});

module.exports = mongoose.model('Game', GameSchema);
