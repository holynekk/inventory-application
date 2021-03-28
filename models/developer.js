var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeveloperSchema = new Schema({
    name: {type: String, required: true},
    imgUrl: {type: String, required: true},
    establish_date: {type: Date},
    summary: {type: String, required: true}
});

DeveloperSchema.virtual('url').get(function(){
    return '/catalog/developer/' + this._id;
});

module.exports = mongoose.model('Developer', DeveloperSchema);