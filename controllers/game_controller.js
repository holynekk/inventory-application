var Game = require('../models/game.js');
var Developer = require('../models/developer.js');
var Genre = require('../models/genre.js');
var GameInstance = require('../models/game_instance.js');
const { body,validationResult } = require('express-validator');


var async = require('async');

exports.index = function(req, res) {
    res.render('index', { title: 'HolyNekK Games'});
};
       
// Display list of all games.
exports.game_list = function(req, res, next) {
    Game.find({}, 'name developer imgUrl genre').populate('developer').exec(function(err, list_games){
        if(err){return next(err);}

        res.render('game_list', {title: 'Holy Games List', game_list: list_games});
    });
};

// Display detail page for a specific game.
exports.game_detail = function(req, res, next) {
    async.parallel({
        game: function(callback){
            Game.findById(req.params.id)
            .populate('developer')
            .populate('genre')
            .exec(callback);
        },
        game_instance: function(callback){
            GameInstance.find({'game': req.params.id}).exec(callback);
        }
    },function(err, results){
        if(err){return next(err);}
        if(results.game == null){
            var err = new Error('Game not found..');
            err.status = 404;
            return next(err);
        }
        res.render('game_detail', {title: results.game.name, game: results.game, game_instances: results.game_instance});
    });
};

// Display game create form on GET.
exports.game_create_get = function(req, res, next) {
    async.parallel({
        developers: function(callback){
            Developer.find(callback);
        },
        genres: function(callback){
            Genre.find(callback);
        },
    }, function(err, result){
        if(err){return next(err);}
        res.render('game_form', {title: 'Create Game', developers: result.developers, genres: result.genres});
    });
};

// Handle game create on POST.
exports.game_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('developer', 'Developer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('imgUrl', 'Img-Url must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);


        var game = new Game(
          { name: req.body.name,
            developer: req.body.developer,
            summary: req.body.summary,
            imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/'),
            genre: req.body.genre
           });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all developers and genres for form.
            async.parallel({
                developers: function(callback) {
                    Developer.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (game.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('game_form', { title: 'Create Game',developers:results.developer, genres:results.genres, game: game, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save game.
            game.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new game record.
                   res.redirect(game.url);
                });
        }
    }
];

// Display game delete form on GET.
exports.game_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: game delete GET');
};

// Handle game delete on POST.
exports.game_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: game delete POST');
};

// Display game update form on GET.
exports.game_update_get = function(req, res, next) {
    async.parallel({
        game: function(callback) {
            Game.findById(req.params.id).populate('developer').populate('genre').exec(callback);
        },
        developers: function(callback) {
            Developer.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.game==null) { // No results.
                var err = new Error('Game not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            
            for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
                for (var game_g_iter = 0; game_g_iter < results.game.genre.length; game_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()===results.game.genre[game_g_iter]._id.toString()) {
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }
            res.render('game_form', { title: 'Update Game', developers: results.developers, genres: results.genres, game: results.game});
        });
};

exports.game_update_post = [

    // Convert the genre to an array
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('developer', 'Developer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('imgUrl', 'imgUrl must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        //console.log("https:&#x5C;&#x2F;&#x5C;&#x2F;hips.hearstapps.com&#x5C;&#x2F;digitalspyuk.cdnds.net&#x5C;&#x2F;13&#x5C;&#x2F;14&#x5C;&#x2F;gaming-gta5-cover.jpeg");
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var game = new Game(
          { name: req.body.name,
            developer: req.body.developer,
            summary: req.body.summary,
            imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/'),
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                developers: function(callback) {
                    Developer.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (game.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('game_form', { title: 'Update Game', developers: results.developers, genres: results.genres, game: game, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Game.findByIdAndUpdate(req.params.id, game, {}, function (err,thegame) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(thegame.url);
                });
        }
    }
];
