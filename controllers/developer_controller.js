var Developer = require('../models/developer.js');
const { body,validationResult } = require('express-validator');
const developer = require('../models/developer.js');
var async = require('async');
var Game = require('../models/game.js');

exports.developer_list = function(req, res) {
    Developer.find({},'name imgUrl').exec(function(err, list_devs){
        if(err){return next(err);}
        res.render('developer_list', {title: 'Developer List', developer_list: list_devs});
    });
};

exports.developer_detail = function(req, res, next) {
    Developer.findById(req.params.id).exec(function(err, dev){
        if(err){return next(err);}
        res.render('dev_detail', {title: dev.name, developer: dev});
    });
    
};

exports.developer_create_get = function(req, res) {
    res.render('developer_form', { title: 'Create Developer'});
};

exports.developer_create_post = [

    body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
    body('establish_date', 'Invalid establish date').toDate(),
    body('imgUrl', 'Img-Url must not be empty').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('developer_form', { title: 'Create Developer', developer: req.body, errors: errors.array() });
            return;
        }
        else {
            var developer = new Developer(
                {
                    name: req.body.name,
                    establish_date: req.body.establish_date,
                    summary: req.body.summary,
                    imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/')
                });
            developer.save(function (err) {
                if (err) { return next(err); }
                res.redirect(developer.url);
            });
        }
    }
];

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
            res.render('developer_delete', {title: 'Delete Developer', developer: results.developer, developer_games: results.developer_games});
            return;
        }
        else{
            Developer.findByIdAndDelete(req.body.developerid, function(err){
                if(err){return next(err);}
                res.redirect('/catalog/developers');
            });
        }
    });
};

exports.developer_update_get = function(req, res, next) {
    async.parallel({
        developer: function(callback){
            Developer.findById(req.params.id).exec(callback);
        },
    }, function(err, results){
        if(err){return next(err);}
        if(results.developer == null){
            var err = new Error('Developer Not Found');
            err.status = 404;
            return next(err);
        }
        res.render('developer_form', {title: 'Update Developer', developer: results.developer})
    });
};

exports.developer_update_post= [
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
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('imgUrl', 'imgUrl must not be empty').trim().isLength({ min: 1 }).escape(),
    body('establish_date', 'Establish date must not be empty.').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var developer = new Developer(
          { name: req.body.name,
            summary: req.body.summary,
            imgUrl: req.body.imgUrl.split('&#x2F;').join('/').split('&#x5C;').join('/'),
            establish_date: req.body.establish_date,
            _id:req.params.id 
           });

        if (!errors.isEmpty()) {
            console.log('ERORORORORORORO');
            res.render('developer_form', { title: 'Update Developer', developer: developer });

        }
        else {

            Developer.findByIdAndUpdate(req.params.id, developer, {}, function (err, thedeveloper) {
                if (err) { return next(err); }
                   res.redirect(thedeveloper.url);
                });
        }
    }
];
