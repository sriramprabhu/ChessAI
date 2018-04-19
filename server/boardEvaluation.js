var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnTableForWhite =
    [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 27, 27, 10,  5,  5],
        [0,  0,  0, 25, 25,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-25,-25, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];

var pawnTableForBlack = reverseArray(pawnTableForWhite);

var knightTable =
    [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-20,-30,-30,-20,-40,-50]
    ];

var bishopTableForWhite = [
    [ -20,-10,-10,-10,-10,-10,-10,-20],
    [  -10,  0,  0,  0,  0,  0,  0,-10],
    [ -10,  0,  5, 10, 10,  5,  0,-10],
    [ -10,  5,  5, 10, 10,  5,  5,-10],
    [ -10,  0, 10, 10, 10, 10,  0,-10],
    [ -10, 10, 10, 10, 10, 10, 10,-10],
    [ -10,  5,  0,  0,  0,  0,  5,-10],
    [ -20,-10,-40,-10,-10,-40,-10,-20]
];

var bishopTableForBlack = reverseArray(bishopTableForWhite);

var rookTableForWhite = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [ 5,  10,  10,  10,  10,  10,  10, 5],
    [ -5,  0,   0,   0,   0,   0,   0, -5],
    [ -5,  0,   0,   0,   0,   0,   0, -5],
    [ -5,  0,   0,   0,   0,   0,   0, -5],
    [ -5,  0,   0,   0,   0,   0,   0, -5],
    [ -5,  0,   0,   0,   0,   0,   0, -5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

var rookTableForBlack = reverseArray(rookTableForWhite);

var queenTable = [
    [ -20, -10, -10, -5, -5, -10, -10, -20],
    [ -10,  0,  0,  0,  0,  0,  0, -10],
    [ -10,  0,  5,  5,  5,  5,  0, -10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [ -10,  5,  5,  5,  5,  5,  0, -10],
    [ -10,  00,  5,  0,  0,  0,  0, -10],
    [ -20, -10, -10, -5, -5, -10, -10, -20]
];

var kingTableForWhite = [

    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -20, -30, -30, -40, -40, -30, -30, -20],
    [ -10, -20, -20, -20, -20, -20, -20, -10],
    [ 20,  20,   0,   0,   0,   0,  20,  20 ],
    [ 20,  30,  10,   0,   0,  10,  30,  20]
];

var kingTableForBlack = reverseArray(kingTableForWhite);

var pawnValue = 10;
var rookValue = 50;
var knightValue = 30;
var bishopValue = 30;
var queenValue = 90;
var kingValue = 900;

var divider = 10;

var boardEvaluation = function (board) {
    var score = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
			if(board[i][j] != null)
				score = score + getPieceValue(board[i][j], i ,j);
        }
    }
    return score;
};

var getPieceValue = function (piece, x, y) {
    
	var isWhite = (piece.color === 'w');
	var finalValue = 0;
    
	switch(piece.type) {
		case 'p':
			finalValue = pawnValue + ( isWhite ? pawnTableForWhite[y][x] : pawnTableForBlack[y][x] ) / divider;
			break;
		case 'n':
			finalValue = knightValue + knightTable[y][x] / divider;
			break;
		case 'b':
			finalValue = bishopValue + ( isWhite ? bishopTableForWhite[y][x] : bishopTableForBlack[y][x] ) / divider;
			break;
		case 'r':
			finalValue = rookValue + ( isWhite ? rookTableForWhite[y][x] : rookTableForBlack[y][x] ) / divider;
			break;
		case 'q':
			finalValue = queenValue + queenTable[y][x] / divider;
			break;
		case 'k':
			finalValue = kingValue + ( isWhite ? kingTableForWhite[y][x] : kingTableForBlack[y][x] ) / divider;
			break;
		default:
			throw "Unknown piece type: " + piece.type;
	}		
	    
    return isWhite ? finalValue : -finalValue;
};

/* export boardEvaluation object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.boardEvaluation = boardEvaluation;
/* export boardEvaluation object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return boardEvaluation;  });