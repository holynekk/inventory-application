var Developer = require('../models/developer.js');
const { body,validationResult } = require('express-validator');
const developer = require('../models/developer.js');
var async = require('async');
var Game = require('../models/game.js');

// Display list of all developers.
exports.developer_list = function(req, res) {
    Developer.find({},'name imgUrl').exec(function(err, list_devs){
        if(err){return next(err);}
        res.render('developer_list', {title: 'Developer List', developer_list: list_devs});
    });
};

// Display detail page for a specific developer.
exports.developer_detail = function(req, res) {
    Developer.findById(req.params.id).exec(function(err, dev){
        if(err){return next(err);}
        res.render('dev_detail', {title: dev.name, developer: dev});
    });
    
};

exports.developer_create_get = function(req, res) {
    res.render('developer_form', { title: 'Create Author'});
};

// Display developer create form on GET.
exports.developer_create_post = [

    // Validate and sanitize fields.
    body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
    body('establish_date', 'Invalid establish date').toDate(),
    body('imgUrl', 'Img-Url must not be empty').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('ERRROROROROROROROROR')
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('developer_form', { title: 'Create Developer', developer: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            console.log('gonna create new deveoper')
            // Create an Author object with escaped and trimmed data.
            var developer = new Developer(
                {
                    name: req.body.name,
                    establish_date: req.body.establish_date,
                    summary: req.body.summary,
                    imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/')
                });
            developer.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(developer.url);
            });
        }
    }
];

// Display developer delete form on GET.
exports.developer_delete_get = function(req, res) {
    async.parallel({
        developer: function(callback){
            Developer.findById(req.params.id).exec(callback)
        },
        developer_games: function(callback){
            Game.find({'developer': req.params.id}).exec(callback)
        },
    }, function(err, results){
        if(err){return next(err);}
        if(results.developer == null){
            res.redirect('/catalog/developers');
        }
        res.render('developer_delete', {title: 'Delete Developer', developer: results.developer, developer_games: results.developer_games })
    });
};

// Handle developer delete on POST.
exports.developer_delete_post = function(req, res) {
    async.parallel({
        developer: function(callback){
            Developer.findById(req.body.developerid).exec(callback)
        },
        developer_games: function(callback){
            Game.find({'developer': req.body.developerid}).exec(callback)
        }
    }, function(err, results){
        if (err){return next(err);}
        if(results.developer_games.length > 0){
            console.log('THERE ARE GAMES MORUK')
            res.render('developer_delete', {title: 'Delete Developer', developer: results.developer, developer_games: results.developer_games});
            return;
        }
        else{
            console.log('NO ERROR MORUK')
            Developer.findByIdAndDelete(req.body.developerid, function(err){
                if(err){return next(err);}
                res.redirect('/catalog/developers');
            });
        }
    });
};

// Display developer update form on GET.
exports.developer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: developer update GET');
};

// Handle developer update on POST.
exports.developer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: developer update POST');
};
