var app = angular.module('gameApp',[]);
app.controller('mainController',['game', '$scope', '$http', '$window',
	function(game, $scope, $http, $window ){
		
		$scope.isAi = (function (element){
			
			return (element.type == 'ai');
		});

		var refresh =	( function () {
			$scope.moves 			= game.getMoves();
			$scope.aiMoves 			= game.getAiMoves();
			$scope.log 				= game.getLog();
			$scope.gameFinished   	= game.getGameFinished();
			console.log( $scope.log);

		});
		
		$scope.gameValue  	= game.start();
		refresh();

		$scope.doAction 	= ( function( index ) {
			$scope.gameValue = game.doMove(index);
			refresh();

		});
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
				var _gameFinished = {};

				var _doMove = ( function (array, index){
					_gameValue += array[index].value;
					_log.push(array[index]);
					array.splice ( index, 1);

				})
				var _addMoves = ( function (){
					var maxValue = calculateMaxValue(_gameValue);
					_moves.push ( 
						new Block( 
								getRandomNumber( -maxValue , 1, true  ) ,
								'you'
						) 
					);
					_aiMoves.push ( 
						new Block( 
								getRandomNumber( -maxValue , 1, true  ) ,
								'ai'
						) 
					);
					
				});
				var _doAIMove = ( function(){
					var index = 0;
					for ( var i = 0; i < _aiMoves.length; i++){
						if ( _aiMoves[i].value === - _gameValue){
							index = i;
						}
					}
					
					console.log('ai did :' + _aiMoves[index].value + ' index : ' + index );
					_doMove(_aiMoves, index);
					


				});
				var _finishGame = ( function ( youWin ){
					console.log ( 'game finished.' + (youWin?'you win':'you lose'));
					_gameFinished.status = true;
					_gameFinished.youWin = youWin;

				});
				return{

					start: function (){
						console.log('game starts');
						//resetting values
						_moves 		= [];
						_aiMoves 	= [];
						_log 		= [];
						_gameValue 	= getRandomNumber( 10, 50);
						_gameFinished = 
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
					getAiMoves: function(){
						return _aiMoves;
					},
					getLog: function(){
						return _log;
					},
					doMove: function ( index ){
						
						
						console.log( 'you did: ' + _moves[index].value)
						_doMove( _moves, index);

						if (_gameValue === 0){
							_finishGame( true );
						}
						else{
							_doAIMove();
							if (_gameValue === 0){
								_finishGame( false );
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
