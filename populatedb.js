#! /usr/bin/env node

console.log('This script populates some test games, developers, genres and gameinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Game = require('./models/game')
var Developer = require('./models/developer')
var Genre = require('./models/genre')
var GameInstance = require('./models/game_instance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var developers = []
var genres = []
var games = []
var gameinstances = []

function developerCreate(name, establish_date, cb) {
  developerDetail = {name: name}
  if (establish_date != false) developerDetail.establish_date = establish_date
  
  var developer = new Developer(developerDetail);
       
  developer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Developer: ' + developer);
    developers.push(developer)
    cb(null, developer)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function gameCreate(name, summary, developer, genre, cb) {
  gameDetail = { 
    name: name,
    summary: summary,
    developer: developer
  }
  if (genre != false) gameDetail.genre = genre
    
  var game = new Game(gameDetail);    
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}


function gameInstanceCreate(game, platform, due_back, status, cb) {
  gameInstanceDetail = { 
    game: game,
    platform: platform
  }    
  if (due_back != false) gameInstanceDetail.due_back = due_back
  if (status != false) gameInstanceDetail.status = status
    
  var gameinstance = new GameInstance(gameInstanceDetail);    
  gameinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Gameinstance: ' + gameinstance);
      cb(err, null)
      return
    }
    console.log('New GameInstance: ' + gameinstance);
    gameinstances.push(gameinstance)
    cb(null, game)
  }  );
}


function createGenredevelopers(cb) {
    async.series([
        function(callback) {
            developerCreate('Valve', '1996-07-24', callback);
        },
        function(callback) {
            developerCreate('Rockstar Games', '1998-12-01', callback);
        },
        function(callback) {
            developerCreate('Electronic Arts', '1998-05-27', callback);
        },
        function(callback) {
            developerCreate('Ubisoft', '1996-03-12', callback);
        },
        function(callback) {
            developerCreate('BioWare', '1995-02-01', callback);
        },
        function(callback) {
          genreCreate("Simulation", callback);
        },
        function(callback) {
          genreCreate("Open World", callback);
        },
        function(callback) {
          genreCreate("RPG", callback);
        },
        function(callback) {
            genreCreate("FPS", callback);
          },
        ],
        // optional callback
        cb);
}


function createGames(cb) {
    async.parallel([
        function(callback) {
          gameCreate('Watch Dogs: Legion', 'Watch Dogs: Legion is a 2020 action-adventure game published by Ubisoft and developed by its Toronto studio. It is the third instalment in the Watch Dogs series, and the sequel to 2016\'s Watch Dogs 2.', developers[3], [genres[1],], callback);
        },
        function(callback) {
          gameCreate("Counter-Strike: Global Offensive", 'Counter-Strike: Global Offensive is a multiplayer first-person shooter developed by Valve and Hidden Path Entertainment. It is the fourth game in the Counter-Strike series. Developed for over two years, Global Offensive was released for Windows, macOS, Xbox 360, and PlayStation 3 in August 2012, and for Linux in 2014.', developers[0], [genres[3],], callback);
        },
        function(callback) {
          gameCreate("Grand Theft Auto V", 'Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the first main entry in the Grand Theft Auto series since 2008\'s Grand Theft Auto IV.', developers[1], [genres[1],], callback);
        },
        function(callback) {
          gameCreate("FIFA 21", "FIFA 21 is a football simulation video game published by Electronic Arts as part of the FIFA series. It is the 28th installment in the FIFA series, and was released on 9 October 2020 for Microsoft Windows, Nintendo Switch, PlayStation 4 and Xbox One.", developers[2], [genres[0],], callback);
        },
        function(callback) {
          gameCreate("Star Wars Jedi: Fallen Order","Star Wars Jedi: Fallen Order is an action-adventure game developed by Respawn Entertainment and published by Electronic Arts. It was released for Windows, PlayStation 4, and Xbox One on November 15, 2019.", developers[2], [genres[1],], callback);
        },
        function(callback) {
          gameCreate('Test Game 1', 'Summary of test Game 1', developers[1], [genres[0],genres[1]], callback);
        },
        function(callback) {
          gameCreate('Test Game 2', 'Summary of test Game 2', developers[2], false, callback)
        }
        ],
        // optional callback
        cb);
}


function createGameInstances(cb) {
    async.parallel([
        function(callback) {
          gameInstanceCreate(games[0], 'PS4', false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[1], ' PC', false, 'Loaned', callback)
        },
        function(callback) {
          gameInstanceCreate(games[2], ' XBOX ONE', false, false, callback)
        },
        function(callback) {
          gameInstanceCreate(games[3], 'PS4', false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[3], 'PC', false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[3], 'PS4', false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[4], 'XBOX', false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[4], 'PS4', false, 'Maintenance', callback)
        },
        function(callback) {
          gameInstanceCreate(games[4], 'PC', false, 'Loaned', callback)
        },
        function(callback) {
          gameInstanceCreate(games[0], 'PC', false, false, callback)
        },
        function(callback) {
          gameInstanceCreate(games[1], 'PS4', false, false, callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createGenredevelopers,
    createGames,
    createGameInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('GameInstances: '+gameinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




