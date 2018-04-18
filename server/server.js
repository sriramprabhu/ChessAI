var express = require('express');
var app = express();

var chess = require('./chess').Chess;
var path = require('path');
//app.set('view engine', 'ejs');
var evaluation = require('./boardEvaluation').boardEvaluation;


var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluation(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname +'/index.html'));
});

app.get('/bestMove', function (req, res) {
	var fen = req.query.fen;
	var depth = req.query.depth;
	console.log(fen);	
	console.log(depth);
	var game = chess();
	game.load(fen);
	
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
	
	if (game.game_over()) {        
		var returnJson = JSON.stringify({game_over: 1});
		res.send(returnJson);		
    }

    positionCount = 0;
    
    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
	console.log(bestMove);	
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);
	var returnJson = JSON.stringify({game_over: 0, move: bestMove, count: positionCount, time: moveTime});
	res.send(returnJson);
		
});

app.use(express.static('static'));

app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});


