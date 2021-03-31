const { body,validationResult } = require('express-validator');
var GameInstance = require('../models/game_instance.js');
var Game = require('../models/game.js');

var async = require('async');


// Display detail page for a specific gameInstance.
exports.gameInstance_detail = function(req, res) {
    GameInstance.findById(req.params.id)
    .populate('game')
    .exec(function (err, gameInstance) {
      if (err) { return next(err); }
      if (gameInstance==null) { // No results.
          var err = new Error('Game copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('gameinstance_detail', { title: 'Copy: '+gameInstance.game.name, gameInstance:  gameInstance});
    })
};

// Display gameInstance create form on GET.
exports.gameInstance_create_get = function(req, res, next) {
    Game.find({},'name')
    .exec(function (err, games) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('gameinstance_form', {title: 'Create GameInstance', game_list: games});
    });
};

// Handle gameInstance create on POST.
exports.gameInstance_create_post = function(req, res) {
    body('game', 'Game must be specified').trim().isLength({ min: 1 }).escape(),
    body('platform', 'Platform must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('price').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var gameinstance = new GameInstance(
          { game: req.body.game,
            platform: req.body.platform,
            status: req.body.status,
            price: req.body.price,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Game.find({},'name')
                .exec(function (err, games) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('gameinstance_form', { title: 'Create GameInstance', game_list: games, selected_game: gameinstance.game._id , errors: errors.array(), gameinstance: gameinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            gameinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect('catalog/games');
                });
        }
    }
};

// Display gameInstance update form on GET.
exports.gameInstance_update_get = function(req, res, next) {
    async.parallel({
        gameinstance: function(callback) {
            GameInstance.findById(req.params.id).exec(callback);
        },
        games: function(callback){
            Game.find(callback);
        }
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.gameinstance==null) { // No results.
                var err = new Error('GameInstance not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            res.render('gameinstance_form', { title: 'Update GameInstance', gameinstance: results.gameinstance, game_list: results.games});
        });
};

// Handle gameInstance update on POST.
exports.gameInstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: gameInstance update POST');
};
