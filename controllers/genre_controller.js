var Genre = require('../models/genre.js');
const {body, validationResult} = require('express-validator');
var async = require('async');
var Game = require('../models/game.js');

exports.genre_list = function(req, res) {
    Genre.find().exec(function(err, genre_list){
        if(err){return next(err);}
        res.render('genre_list', {title: 'Game Tags', game_tags: genre_list});
    });
    
};

exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre' });
};


exports.genre_create_post =  [

    body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    body('imgUrl', 'URL is required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
      const errors = validationResult(req);

      var genre = new Genre(
        { name: req.body.name, imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/') }
      );
  
      if (!errors.isEmpty()) {
        res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
      }
      else {
        Genre.findOne({ 'name': req.body.name })
          .exec( function(err, found_genre) {
             if (err) { return next(err); }
  
             if (found_genre) {
               res.redirect('/catalog/genres');
             }
             else {
  
               genre.save(function (err) {
                 if (err) { return next(err); }
                 res.redirect('/catalog/genres');
               });
  
             }
  
           });
      }
    }
  ];


exports.genre_delete_get = function(req, res, next) {
    async.parallel({
        genre: function(callback){
            Genre.findById(req.params.id).exec(callback);
        },
        genre_games: function(callback){
            Game.find({'genre': req.params.id}).exec(callback)
        },
    }, function(err, results){
        if(err){return next(err);}
        if(results.genre === null){
            res.redirect('/catalog/genres');
        }
        res.render('genre_delete', {title: 'Delete Genre', genre: results.genre, genre_games: results.genre_games})
    });
};

exports.genre_delete_post = function(req, res, next) {
    async.parallel({
        genre: function(callback) {
          Genre.findById(req.body.genreid).exec(callback)
        },
        genre_games: function(callback) {
          Game.find({ 'author': req.body.genreid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre_games.length > 0) {
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_games: results.genre_games } );
            return;
        }
        else {
            Genre.findByIdAndRemove(req.body.genreid, function(err) {
                if (err) { return next(err); }
                res.redirect('/catalog/genres')
            })
        }
    });
};