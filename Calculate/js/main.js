var app = angular.module('gameApp',[]);
app.controller('mainController',['game', '$scope', '$http', '$window',
	function(game, $scope, $http, $window ){
		
		var blocksNumber = 3;
		//var scrollVal = $(window).scrollTop();
		
		$scope.animation = {
			block1: {show:false,value: $('.page1').offset().top},
			block2: {show:false,value: $('.page2').offset().top},
			block3: {show:false,value: $('.page3').offset().top}
			
			

		};
		console.log ( $scope.animation);
		$(window).on('scroll', function(){
			var scrollValue = $(window).scrollTop();
			console.log ('scrolling:' + scrollValue );
			for ( var i = 1; i <= blocksNumber;i++){
				if ( $scope.animation['block' + i].value -100 < scrollValue ){
					$scope.animation['block' + i].show = true;
				}
			}
			$scope.$apply();

		})
		//console.log ( animation);



		$scope.isAi = (function (element){
			
			return (element.type == 'ai');
		});

		var refresh =	( function () {
			$scope.moves 			= game.getMoves();
			$scope.aiMoves 			= game.getAiMoves();
			$scope.log 				= game.getLog();
			$scope.gameFinished   	= game.getGameFinished();
			$scope.passCount        = game.getPassCount();
			console.log( $scope.log);

		});
		
		$scope.gameValue  	= game.start();
		refresh();

		$scope.doAction 	= ( function( index ) {
			$scope.gameValue = game.doMove(index);
			refresh();

		});
		$scope.doPass = ( function (){
			$scope.gameValue = game.doMove();
			refresh();
		})
		$scope.restartGame = (function(){
			$scope.gameValue = game.start();
			refresh();
		});
		console.log( $scope.gameValue);
	}
]);

app.provider('game', [ function (){
		
		/* RANDOM GENERATION*/
		var getRandomNumber = (function ( min, max, notNull){

			var value = 0;
			
			if ( notNull == undefined){
				notNull = false;
			}
			value =  Math.floor(Math.random() * (max - min + 1) ) + min;
			while  ( (value === 0 ) && ( notNull) ){
				value = Math.floor(Math.random() * (max - min + 1) ) + min;
			}
			return value;

		});
		var calculateMaxValue = (function (value){
			var maxValue = Math.floor( value/5 ) + 1;
			if ( maxValue <= 1 ){
				maxValue = 3;
			}
			return maxValue;
		});

		/*block object stuff*/
		var blockPrototype = {
			_value:undefined,
			_type:undefined,
			get value(){
				return this._value;
			},
			set value (value){
				this._value = value;
				return this; 
			},
			set type (type){
				this._type = type;
				return this;
			},
			get type (){
				return this._type;
			}

		}
		Block.prototype = blockPrototype;
		
		function Block ( value, type ){
			this.value 	= value;
			this.type 	= type;
		}

		

		/*private functions*/
		
		return {
			$get: function(){
				/*private values*/
				var _gameValue;
				var _startingMovesNumber = 3;
				var _moves = [];
				var _aiMoves = [];
				var _log = [];
				var _passCount;
				var _gameFinished = {};

				var _doMove = ( function (array, index){
					//if ( array !== null){
					_gameValue += array[index].value;
					_log.push(array[index]);
					array.splice ( index, 1);
					
					
					

				});
				var _addMoves = ( function (){
					var maxValue = calculateMaxValue(_gameValue);
					_moves.push ( 
						new Block( 
								getRandomNumber( 0 , 5, true  ) ,
								'you'
						) 
					);
					_aiMoves.push ( 
						new Block( 
								getRandomNumber( -3 , 3, true  ) ,
								'ai'
						) 
					);
					
				});
				var _doAIMove = ( function(){
					//game finished
					var index = -1;
					for ( var i = 0; i < _aiMoves.length; i++){
						if ( _aiMoves[i].value + _gameValue >= _gameFinishedValue ){
							index = i;
						}
					}
					//finding first allowed move
					if ( index === -1 ){
						for ( var i = 0; i < _aiMoves.length; i++){
							if ( _aiMoves[i].value + _gameValue > 0 ){
								index = i;
								break;
							}
						}
					}
					//pass
					if (index === -1 ){
						_aiMoves.push( new Block(0, 'ai'));
						_doMove ( _aiMoves, _moves.length - 1);
						return;
					}
					
					console.log('ai did :' + _aiMoves[index].value + ' index : ' + index );
					_doMove(_aiMoves, index);
					


				});
				var _finishGame = ( function ( gameValue, userMove ){
					var youWin = false;
					if (gameValue === 33){
						console.log ( 'game finished.' + (userMove?'you win':'you lose'));
						youWin = userMove;
					}
					else{
						console.log ( 'game finished.' + 'you lose');
					}
					_gameFinished.status = true;
					_gameFinished.youWin = youWin;

				});
				return{

					start: function (){
						console.log('game starts');
						//resetting values
						_moves 				= [];
						_aiMoves 			= [];
						_log 				= [];
						_gameValue 			= 0;
						_passCount 			= 3;
						_gameFinishedValue 	= 33;
						_gameFinished 		= 
						{	
							status:false,
							youWin:undefined
						};
						console.log('game value: ' + _gameValue);
						
						for ( var i = 0; i < _startingMovesNumber; i++){
							_addMoves();
							
						}
						return _gameValue;
					},
					getMoves: function(){
						return _moves;
					},
					getPassCount: function(){
						return _passCount;
					},
					getAiMoves: function(){
						return _aiMoves;
					},
					getLog: function(){
						return _log;
					},
					doMove: function ( index ){
						
						
						if (index !== undefined ){
							
							//pass
							console.log( 'you did: ' + _moves[index].value)
							_doMove( _moves, index);
						}
						else{
							_passCount--;
							_moves.push( new Block(0, 'you'));
							_doMove ( _moves, _moves.length - 1);
						}
							if (_gameValue >= _gameFinishedValue){
								_finishGame( _gameValue, true );
							}
							else{
								_doAIMove();
								if (_gameValue >= _gameFinishedValue){
									_finishGame( _gameValue, false );
								}
								else{
									_addMoves();
								}
							}
						return _gameValue;
					},
					getGameFinished: function (){
						return _gameFinished;
					}
				}
			}
		}
	
	}
]);	
