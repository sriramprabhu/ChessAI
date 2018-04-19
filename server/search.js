var evaluation = require('./boardEvaluation').boardEvaluation;
var MAX = -99999;
var MIN = 99999;
var ALPHA = -100000;
var BETA = 100000;

var minimaxRoot =function(depth, game) {

    var moves = game.ugly_moves();
    var topScore = MAX;
    var bestMove;

    for(var i = 0; i < moves.length; i++) {        
        game.ugly_move(moves[i]);
        var value = minValue(depth - 1, game, ALPHA, BETA);
        game.undo();
        if(value >= topScore) {
            topScore = value;
            bestMove = moves[i];
        }
    }
    return bestMove;
};

var maxValue = function(depth, game, alpha, beta) {
	
	positionCount++;
    if (depth === 0) {
        return -evaluation(game.board());
    }

    var moves = game.ugly_moves();
	var topScore = MAX;
	for (var i = 0; i < moves.length; i++) {
		game.ugly_move(moves[i]);
		topScore = Math.max(topScore, minValue(depth - 1, game, alpha, beta));
		game.undo();
		alpha = Math.max(alpha, topScore);
		if (beta <= alpha) {
			return topScore;
		}
	}
	return topScore;
};

var minValue = function(depth, game, alpha, beta) {
	
	positionCount++;
    if (depth === 0) {
        return -evaluation(game.board());
    }

    var moves = game.ugly_moves();
	var topScore = MIN;
	for (var i = 0; i < moves.length; i++) {
		game.ugly_move(moves[i]);
		topScore = Math.min(topScore, maxValue(depth - 1, game, alpha, beta));
		game.undo();
		beta = Math.min(beta, topScore);
		if (beta <= alpha) {
			return topScore;
		}
	}
	return topScore;
};


/* export minimaxRoot object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.minimaxRoot = minimaxRoot;
/* export minimaxRoot object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return minimaxRoot;  });
