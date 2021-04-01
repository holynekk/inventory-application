var Game = require('../models/game.js');
var Developer = require('../models/developer.js');
var Genre = require('../models/genre.js');
var GameInstance = require('../models/game_instance.js');
const { body,validationResult } = require('express-validator');


var async = require('async');

exports.index = function(req, res) {
    res.render('index', { title: 'HolyNekK Games'});
};
       
exports.game_list = function(req, res, next) {
    Game.find({}, 'name developer imgUrl genre').populate('developer').exec(function(err, list_games){
        if(err){return next(err);}
        res.render('game_list', {title: 'Holy Games List', game_list: list_games});
    });
};

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


exports.game_create_post = [
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },


    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('developer', 'Developer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('imgUrl', 'Img-Url must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),
    

    (req, res, next) => {
        const errors = validationResult(req);


        var game = new Game(
          { name: req.body.name,
            developer: req.body.developer,
            summary: req.body.summary,
            imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/'),
            genre: req.body.genre
           });
        if (!errors.isEmpty()) {
            async.parallel({
                developers: function(callback) {
                    Developer.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

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
            game.save(function (err) {
                if (err) { return next(err); }
                   res.redirect(game.url);
                });
        }
    }
];

exports.game_delete_get = function(req, res) {
    async.parallel({
        game: function(callback) {
          Game.find({ '_id': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.game==null) {
            res.redirect('/catalog/games');
        }
        res.render('game_delete', { title: 'Delete Game', game: results.game} );
    });
};

exports.game_delete_post = function(req, res, next) {
    async.parallel({
        game: function(callback) {
            Game.findById(req.body.gameid).exec(callback);
          },
    }, function(err, results) {
        if (err) { return next(err); }
        else {
            Game.findByIdAndRemove(req.body.gameid, function(err) {
                if (err) { return next(err); }
                res.redirect('/catalog/games');
            })
        }
    });
};

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
            if (results.game==null) { 
                var err = new Error('Game not found');
                err.status = 404;
                return next(err);
            }
            
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

    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('developer', 'Developer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('imgUrl', 'imgUrl must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var game = new Game(
          { name: req.body.name,
            developer: req.body.developer,
            summary: req.body.summary,
            imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/'),
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id 
           });

        if (!errors.isEmpty()) {

            async.parallel({
                developers: function(callback) {
                    Developer.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

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
            Game.findByIdAndUpdate(req.params.id, game, {}, function (err,thegame) {
                if (err) { return next(err); }
                   res.redirect(thegame.url);
                });
        }
    }
];
