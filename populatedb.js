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

function developerCreate(name, imgUrl,establish_date, summary,cb) {
  developerDetail = {
    name: name,
    imgUrl: imgUrl,
    summary: summary 
  }
  if (establish_date != false) developerDetail.establish_date = establish_date;
  
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

function gameCreate(name, imgUrl,summary, developer, genre, cb) {
  gameDetail = { 
    name: name,
    imgUrl: imgUrl,
    summary: summary,
    developer: developer
  }
  if (genre != false) gameDetail.genre = genre;
    
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
            developerCreate('Valve', 'https://egamersworld.com/uploads/blog/1546870744203-1.jpg','1996-07-24', 'Valve Corporation, also known as Valve Software, is an American video game developer, publisher, and digital distribution company headquartered in Bellevue, Washington.Valve Corporation, also known as Valve Software, is an American video game developer, publisher, and digital distribution company headquartered in Bellevue, Washington.', callback);
        },
        function(callback) {
            developerCreate('Rockstar Games', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOoAAADXCAMAAAAjrj0PAAABKVBMVEX/qwAEAwH///8AAAAAAAH/sQD/rwD/rQCldyBSQyCEhIT/tA0lIhdeXV3RjADnmwB8UwHj4+P5pwAAAAxTNwCtdADJhwDtnwBkQwGeagC8fgDXkADzowD39/fPiwA6JwFGLwHs7OyhoaGsrKzT09OQkJAREA8uHwEiFwHAgQBCLAGlbwCOXwANAADExMQ1NTQcHBtJSUhpaWkrKiqLZBrKjBkZFw5wcG/6rR5xTAEcEwFPNQEoGwGXZQCKhX2+urKGWgCDXhc8LhJNTU1tUBWVah0xLBvAhhxJNxVSPhViRxI/MBGreRpoRQBzb2VsZ13c18+znXuQeFHl1782HwDx59ctJhq7q5E9NihvXD1QSj/SxrKIeF6hlYFOQSslBQAxFQBtYUqEd12NRWfMAAAOkklEQVR4nN2d+1/bOBLAHUuyewk0hEApJOGRF1BoIIR3S1sotKWl3e7ede+2+7jb/f//iNPDTpxEkmN7vFE8v9APxcFfZjSaGY0kyw6TUqeVn+/22jlTpd3rHuXrna0wEEuPWX+LfJk2kVL8Fzw8amhxNail1qHRiKPCXrbbqEVH7XT7mGgWpP+mR81oqI3e4GGM5m4Xru8emSp31xe37/q49MtbOawUtdnzH8M3x+8rBeKYLqRQebid69MeyQatBLV2xp+gz314KBYc17VmQVzXcSrHbR+2PglqxwMtHxeJM22AaOI65OTee/3umH8aQ+UqpaCPFmeMU4hbePzBg+3oUWsH4seuz2cSlIlLTuaEuuo61JL4g9xUyLRfOIm47rFgzatRm+Injp3Z8ERqIetlrrMzFaogLZ/MtEqFuIv3Y6wBVG696LQ4s6N0SMhHzpqXoW5x0pvqrBuvL+Sas9YlqD1G+m4xK6SWVbjmnqc5hnrErTczOmXCbRih2ghqg3uklSyRUtYbRjU/jCoG6kk2PFJf3BU25/hhk4f6ln3rLgOzzLA477kJB1E77DufMkdKTfiWkbUCqG2UQ7iYrYEq5JyasOeZOGqdoV9nUKnUhB+QH0hYvlLL59N+q3TEOfXVavkTzV3GvK8vLldr3UM9yLBSKSuz2Z5ALfGRmlGlUgu+Y3xNjppn/yxO+43Sk6LnmChqjir4JpPuVwj5RAHbDJXb76PM2i+14EeMsERR+aRayWL44IlbYYQNijpP1TuXYaV6U+sZRT2kXz9meKiKvBUd2FaNafcq21q94gGT1eSJaoaHKh2sPJXbslj+hrPslXy/1LTqLH/LbFQo5BxTyI6VZ6gF2I92ownsL5cIR20wVIxhHfDK+uMIUilW2Wqhk+LqSQFhmtwIVFCtOvs4smw/vVh9UiUp4RJWimilYMBkCUdtTvGAN66KJA1YMkch8ymgujgy6gB4cy2FsZsWqluMSerh7jwBD91SQ11LgspgP1vAik0L1XmTDJXCXgLXadNCJZtJUaliYRePUnNLcb1SkPV0EfKNUkJ1K8lJKetTSN+UEqqzDIGaw7uAJpwW6gIM6g5gCp0SKtkBQQVVa0qoizCkObwEN1rTQXUfQ6HiKthLpYPqrAKh5vAamAWng0qegqEugDmmlAxY4ZWkWaoedRNssKaDuqIg3Vwak81LLS7GZmvV3VWgVsm4WIuPV7fVsBgsOEwF1dmXvrmqeuU65MmlihWuDyUVVEWxRRPSOpaqPgNXnU5Hq3J7xKuaceduKIx+3WRUVbFF+9aqXAg/MRpVUWzRexjyQm4KRmtVUWzBG9p5w9mTP/XYZFQiH3b4QhsNKGYosz3wosIrLWu1qhisRs+rSgejnzbk2RDgSlIKqIpiCw7Rj9yAARPWFFDJhcIr6V9a7pbwvskxsLMtR32jf2l54gc3raaBqii2hCXZUmcWZvVRBB7VXVeg6mcNhf1+Nrm2pCi2hCSernyGgouV0kBVFFv0rtS1nklJtwHL+ymgKgIInSt15KSmV/dVaY36rR1nTfHneWH0mo262OLIWngcQlb2FPUW4FVHcFRVseWyIpEna1cXOVUVDeFd0KZHcFRF2imvi2qLo3gPth0CfqwCrCGLPw0wKThqss6WIOkadIsLOGrCzhYfdAN+szs0KsQaMsbt5RT60aBRFcWWCJgYP1u20ug3B3dLiUgp59Je0UmnsR4YNVlnC94vumn1jYKjKiqcE7NurLqp7ZUARlUUWyZnxXg3rS0w0FqVF1siwV6lxAqMWsWJjwFEIfXi2AKL6j4BCCAgu1qCAosK09kSVluMKbCoqs6WSJ0e9KcBwCQvB6tVVY4drbUFsPgbEFhUeVqDN0ZPeyTVyvJnTaYKV9IPCCiqat1QstroUtwFFSxkZ+FAQFFVxRbF7EF2Fax4x3hURcO+crWRqDoJcknfRPrbQMeqvEKvXndRlccVTyRbv4FEVa17P1Oao+oJvCJ916VE3goSVbWGrIkIiDRmRlJUGoolUisoqrzYolttlDfDyFGdnWSdaaCoioUXzWqj3BCkBkyDzmR90JCoinVDXeOGqtdDEvBXaXyVKLQARFU07Gv3Bcn9kgyVJf3JthgBoqrayXTHTcgr5JLJhv9N8EtDUFWdLbrYfWJUhxVdk2WykKg5Oaru9RSoY9GS574SdeEBosob9vFL3dspxurpqM17Hi+RC4ZDVRRb9D0qCtTLkWeIN2Nrm6fDBA7VuZKj7uneTjHZjGQ2wsxRaPOpXuBQVQ372ghHbgqjjS0Oy5jQF0TDaSO0ap1GTGuYuPJoabgd0WG5HjorsWM6TBirijXkkM4jeYlxNBeiLhmhLXYmlDzlmUzgUOVpdsieNvkAH94dRlhtg50siVCiAhsYqqphX1+qlz81hOqu0IkGndq23UUhTk4vYKhRiy1CHGmENWTAvFLBz2xmfinBxkc4A5au1oRVrxVNwAG3xH20OIm7gRJtfIRCVZVOQlrn5LYQnFedS+6TGOprlGjjIxSqqtgSkmESecPoYIbiLto7m3oLKeoTkwkYavRiC//1isJFH6jKfFJOnDheYy44fs0FClVeD6OpSMhjit1hfpsp+YwH58izI4wTLL5CoVblxZZciA44iuQ5L53nHgB1/bsefkBJlnOAUOMUW5iolj42BRBLyBEq+ah1lGQ5BwiVlfNkEna2p+qsFzFY+f8GbmhhLnh72mPV2VuQyUWYE1FudeVREUvIBxd58EO4UfyyN5gHlkuoCoh8kzneoc8WmFdHDXsg3AVLu8UnOPcxtaOlJhRl//v+7toyO07yIEBqP2cueKWoFt2sO21Uiyj619hIR8E7dzwXrGkXx3hJV7KbOqpF5IUaIcO3gdmvdF1RYd3S00cV+WhOcevp8EWFr9WoGG+uhASh00f16oGofTiu1PoQqf1Veecqxqth3dImoHrhH/pqh0ppVLZ+5Kz4ZfhVhUagWs7TSVlH5SfEPdWbCc4oNQPVcl5w1tD7q0fkn//iKsXrk0SLhqBa7mYM1h+FSj9PdnOqKaiWxZba0Jz66uox+XYvSCfdkGMMqrv4krH+PDHrvwVo2BQzEGNQLbfKwmH0nwlV+osgDZ1iBmIOqij45tD3SUh/fc790WWU23ANQmUZ3YSsv00+xQzEJFTLEaw/hIB+3RZTTMQzsI1CtZwKZ/2iJf1dqPRp1Mu5zUK1nPUw1m9/CNLlyDUmw1BZjzAL818rSQXos4mnmMBHG4ZqFV4M15PGUMWuoxjFNNNQReU3ryK17f+ymkusAqlpqGxpThsK/4n0/W2ajzYLlU6taLTKMix/UdSLLKCygkSgnC+R31HoIVWqzzYLlTcDzGtI7V9R+EqQXMxCFR0eTR3qN6Rq7Q/9cKNQ+cpFd5itNuyj4i+yGoUqlsg7Q2ivR0tOL1HMrkqjUHkv1tDKRek7K3/Wg9/6Je5sYxKqWGMMxoSveOUTDeU6v6GYJ6YZhXrp9WL5tvucB7wM9t1gwLLZZnPGtcpb9wZrjMx2Wbx7ynOdgbLZbBNrL69BqKIbYNh2MV519wTrq8Fso2+SV4k5qKLtrNX3uyL/rjoWqeQ463cv3WGzTZxDg81BJYPszbfdbVG1dxd5VzV6Lmad/8WcbYxBFdnbq6Dt7vWrZORKGDEfyH/GbOkxBrWfvfm2exGsHRFRiOGzDnPBcXr4TUEV2duXge2OVHidKm/RQz9viZaeGUYV2dtX33aXx3pjXOeNUGzna8wGUlNQefY2NydUuiCte5I1wfoXCu9dlIkhqKIBT4BuqFYnnOJLb79NrNzGENT+hnxW4FVSuNaF93NxGkjNQPX3oKhsty9k2dscFyO3MQPV4kE9xpvFMM9KKrxTL86mXSNQefaGMV6b4Ag411rCKOwSCqmYgbqD2RLihKcXEt6QG72B1ARUmr1h/CLUdvvCQqcYlTQTUMkGO+cuwuzBQqfo55kbgEqzt/2Ipxe6ZGEvOurp9FHfTG67fXGiG3ABcdTWVMdqejfUB6XAEoqWVWeo53/Lb5yanDPUutWIGULPkPAdEahhdSgqArvlyUhx1xljx2qyLw/ZRn1gjCWLLfqgu9TOqzVBnGO266Fm2T369T6t42qNEPKBIvZsy56nX8ugN6abJtUyRTyiqHVmyCcZHqzuCeLLJBbbbpbtwepcc69EUdnyADrN8GAtMPtt2ww1z6DB7jo1ToT95jkqn1lvM6tW8lHYL0Pl0012w+Civ2uSodaz7JjINfKWqS2vSwaVM6pWrlS+TM1QhWO6zuRoFSO11UflaoW7cNogEe5X9B5wVDFabzKo1sVTf6T6qPYh90yZYyW3jKtnB1GbvCHqJGNemDxwrOYQqn3G8MugF9FNXZwTjAI98j4qiyNopFjNEKtbLDOmfudiH7XEVnPRu8XMsPIei+BugD6q3RGsWdGrU+E6DXRTD1DZAWT0/07hr2mbhpATQRroRg2g2i3OWj7JwJxTuOM2OnQMTBCVsvL/P07taq+/SZzz+3HSYVRqw1yxN1H2wRonbuF9WfRNiwb5Titf3xpDFb6J/tDtyqzCuqTyyYPgHqnUq5dKnW5rDNXeOhCqLx+fp3C5YuriFh5/9EC7vBW11q5tlTolO98aQ2UZnfhRfF1J7z6+VMQl7vsP4qjM/gaHs6aNWvXDln2wNY5qNw88WDR3V1mkuDPA67L7j05uy8gD7fo7zrq2jWp2s2s36hJU7p28R1D7/u595bxATJZCobj+cH1T7r91u79hpzZv2+18a75pN8+kqCyB9Y744Yf9YFR+98c/DJWbU4Tx4EwihA4DU0ztLUVtNA6b1A8rUKlmD/yHFUc/mSSB9+wOb8GizolGwY0jOmiVqHTM5tvBzzFc+Kv2WqO7Qjvzdn7LbjZKBxIPHJRS46g3PV1Fk4OzhmxLc4tvFG32aiGoTGpNGm6czRssZ/lWp6ncjt/pvj06YOn5/wH/rE16ALcOlAAAAABJRU5ErkJggg==','1998-12-01', 'Rockstar Games, Inc. is an American video game publisher based in New York City. The company was established in December 1998 as a subsidiary of Take-Two Interactive, using the assets Take-Two had previously acquired from BMG Interactive.', callback);
        },
        function(callback) {
            developerCreate('Electronic Arts', 'https://images.barrons.com/im-149557?width=1280&size=1','1998-05-27', 'Electronic Arts Inc. is an American video game company headquartered in Redwood City, California. It is the second-largest gaming company in the Americas and Europe by revenue and market capitalization after Activision Blizzard and ahead of Take-Two Interactive, CD Projekt, and Ubisoft as of May 2020.', callback);
        },
        function(callback) {
            developerCreate('Ubisoft', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ubisoft_logo.svg/250px-Ubisoft_logo.svg.png','1996-03-12', 'Ubisoft Entertainment SA is a French video game company headquartered in the Montreuil suburb of Paris with several development studios across the world. Its video game franchises include Rayman, Raving Rabbids, Prince of Persia, Assassin\'s Creed, Far Cry, Watch Dogs, Just Dance, and the Tom Clancy\'s series. ',callback);
        },
        function(callback) {
            developerCreate('BioWare', 'https://yt3.ggpht.com/ytc/AAUvwnj2noCXkJIcIdQRW8VCQbGQAv6b684kRtqtyNulrA=s900-c-k-c0x00ffffff-no-rj','1995-02-01', 'BioWare is a Canadian video game developer based in Edmonton, Alberta. It was founded in 1995 by newly graduated medical doctors Ray Muzyka and Greg Zeschuk, alongside Trent Oster, Brent Oster, Marcel Zeschuk and Augustine Yip. As of 2007, the company is owned by American publisher Electronic Arts.',callback);
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
          gameCreate('Watch Dogs: Legion', 'https://store.ubi.com/dw/image/v2/ABBS_PRD/on/demandware.static/-/Sites-masterCatalog/ia/dw152ed9e0/images/large/5cec2d5839798c0870c07698.jpg?sw=341&sh=450&sm=fit','Watch Dogs: Legion is a 2020 action-adventure game published by Ubisoft and developed by its Toronto studio. It is the third instalment in the Watch Dogs series, and the sequel to 2016\'s Watch Dogs 2.', developers[3], [genres[1],], callback);
        },
        function(callback) {
          gameCreate("Counter-Strike: Global Offensive", 'https://static.wikia.nocookie.net/counterstrike/images/1/1e/Csgo_steam_store_header_latest.jpg/revision/latest?cb=20190621081933&path-prefix=tr','Counter-Strike: Global Offensive is a multiplayer first-person shooter developed by Valve and Hidden Path Entertainment. It is the fourth game in the Counter-Strike series. Developed for over two years, Global Offensive was released for Windows, macOS, Xbox 360, and PlayStation 3 in August 2012, and for Linux in 2014.', developers[0], [genres[3],], callback);
        },
        function(callback) {
          gameCreate("Grand Theft Auto V", 'https://hips.hearstapps.com/digitalspyuk.cdnds.net/13/14/gaming-gta5-cover.jpeg?resize=480:*','Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the first main entry in the Grand Theft Auto series since 2008\'s Grand Theft Auto IV.', developers[1], [genres[1],], callback);
        },
        function(callback) {
          gameCreate("FIFA 21", 'https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-21/cover-athlete/common/fifa21-cover-section-2.png.adapt.320w.png',"FIFA 21 is a football simulation video game published by Electronic Arts as part of the FIFA series. It is the 28th installment in the FIFA series, and was released on 9 October 2020 for Microsoft Windows, Nintendo Switch, PlayStation 4 and Xbox One.", developers[2], [genres[0],], callback);
        },
        function(callback) {
          gameCreate("Star Wars Jedi: Fallen Order", 'https://static.wikia.nocookie.net/yildizsavaslari/images/5/57/Fallen-Order-Box-Art.jpg/revision/latest?cb=20190608180019&path-prefix=tr',"Star Wars Jedi: Fallen Order is an action-adventure game developed by Respawn Entertainment and published by Electronic Arts. It was released for Windows, PlayStation 4, and Xbox One on November 15, 2019.", developers[2], [genres[1],], callback);
        },
        function(callback) {
          gameCreate('Test Game 1', 'https://thumbnails.pcgamingwiki.com/1/1a/Need_for_Speed_Underground_2_cover.jpg/300px-Need_for_Speed_Underground_2_cover.jpg','Summary of test Game 1', developers[1], [genres[0],genres[1]], callback);
        },
        function(callback) {
          gameCreate('Test Game 2', 'https://giantbomb1.cbsistatic.com/uploads/original/0/4315/1294874-okl_25_to_life_pc_okl.jpg','Summary of test Game 2', developers[2], false, callback)
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




