const { body,validationResult } = require('express-validator');
var GameInstance = require('../models/game_instance.js');
var Game = require('../models/game.js');

var async = require('async');

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
      res.render('gameinstance_detail', { title: 'Copy: '+gameInstance.game.name, gameInstance:  gameInstance});
    })
};

exports.gameInstance_create_get = function(req, res, next) {
    Game.find({},'name')
    .exec(function (err, games) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('gameinstance_form', {title: 'Create GameInstance', game_list: games});
    });
};

exports.gameInstance_create_post = function(req, res) {
    body('game', 'Game must be specified').trim().isLength({ min: 1 }).escape(),
    body('platform', 'Platform must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('price').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),


    (req, res, next) => {

        const errors = validationResult(req);

        var gameinstance = new GameInstance(
          { game: req.body.game,
            platform: req.body.platform,
            status: req.body.status,
            price: req.body.price,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            Game.find({},'name')
                .exec(function (err, games) {
                    if (err) { return next(err); }
                    res.render('gameinstance_form', { title: 'Create GameInstance', game_list: games, selected_game: gameinstance.game._id , errors: errors.array(), gameinstance: gameinstance });
            });
            return;
        }
        else {
            gameinstance.save(function (err) {
                if (err) { return next(err); }
                   res.redirect('catalog/games');
                });
        }
    }
};


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
            if (results.gameinstance==null) { 
                var err = new Error('GameInstance not found');
                err.status = 404;
                return next(err);
            }
            res.render('gameinstance_form', { title: 'Update GameInstance', gameinstance: results.gameinstance, game_list: results.games});
        });
};

exports.gameInstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: gameInstance update POST');
};
