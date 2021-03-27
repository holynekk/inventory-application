var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeveloperSchema = new Schema({
    name: {type: String, required: true},
    establish_date: {type: Date}
});

DeveloperSchema.virtual('url').get(function(){
    return '/catalog/developer/' + this._id;
});

module.exports = mongoose.model('Developer', DeveloperSchema);