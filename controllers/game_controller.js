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
    Game.find({}, 'name developer').populate('developer').exec(function(err, list_games){
        if(err){return next(err);}

        res.render('game_list', {title: 'Holy Games List', game_list: list_games});
    });
};

// Display detail page for a specific game.
exports.game_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: game detail: ' + req.params.id);
};

// Display game create form on GET.
exports.game_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: game create GET');
};

// Handle game create on POST.
exports.game_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: game create POST');
};

// Display game delete form on GET.
exports.game_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: game delete GET');
};

// Handle game delete on POST.
exports.game_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: game delete POST');
};

// Display game update form on GET.
exports.game_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: game update GET');
};

// Handle game update on POST.
exports.game_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: game update POST');
};
