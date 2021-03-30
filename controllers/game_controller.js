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
            imgUrl: req.body.imgUrl,
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
        game: function(callback){
            Game.findById()
        }
    });
};

// Handle game update on POST.
exports.game_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: game update POST');
};
