var express = require('express');
var app = express();

var chess = require('./chess').Chess;
var path = require('path');

var minimaxRoot = require('./search').minimaxRoot;

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
    var bestMove = minimaxRoot(depth, game);
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


