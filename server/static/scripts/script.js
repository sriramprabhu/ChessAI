var board, game = new Chess();

/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
	
	var curr_fen = game.fen();
	var depth = parseInt($('#search-depth').find(':selected').text());	
	var jsonResponse;
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://localhost:3000/bestMove?fen="+curr_fen+"&depth="+depth, true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {				
		jsonResponse = JSON.parse(xhr.responseText);
		console.log(jsonResponse);
		game_over = jsonResponse.game_over;
		console.log(game_over);
		if(game_over === 1) {
			alert('Game Over');
			return;
		}
		
		var bestMove = jsonResponse.move;
		var positionCount = jsonResponse.count;
		var moveTime = jsonResponse.time;
		
		//get best move in response.
		var positionsPerS = ( positionCount * 1000 / moveTime);

		$('#position-count').text(positionCount);
		$('#time').text(moveTime/1000 + 's');
		$('#positions-per-s').text(positionsPerS);
		
		
		console.log(bestMove);
		console.log(positionCount);
		
		game.ugly_move(bestMove);
		board.position(game.fen());
		renderMoveHistory(game.history());
		if (game.game_over()) {
			alert('Game over');
		}
	  }
	}
	xhr.send();
	
	
};


var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {
	
	var promotion = document.querySelector('input[name="promotion"]:checked').value;	
	var piece = 'q';
	switch(promotion) {
		case "Queen":
			piece = 'q';
			break;
		case "Rook":
			piece = 'r';
			break;
		case "Knight":
			piece = 'n';
			break;
		case "Bishop":
			piece = 'b';
			break;
		default:
			piece = 'q';			
	}
		
    var move = game.move({
        from: source,
        to: target,
        promotion: piece
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());	
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);