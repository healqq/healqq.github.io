var app = angular.module('mailApp',[]);
app.controller('mainCtrl',['gmailService', 'dataService', '$scope', '$http', '$window',
	function(gmailService, dataService, $scope, $http, $window ){
	
		
		$scope.token = gmailService.getToken();
		$scope.loadEmails = (function(){
			gmailService.sendRequest('list', {}, dataService.setLetters);
			console.log ( dataService.getLetters() );
		});
		
		
	}	
]);


app.provider('dataService', [ function (){
		/*request types param filler*/
		
		
		
		
		
		return {
			$get: function(){
				var _letters = {};
				
				return{
					setLetters: function( data){
						for (var i=0; i< data.messages.length; i++ ){
							_letters[data.messages[i].id] = {loaded: false}; 
						}
					},
					getLetters: function(){
						return _letters;
						
					}
					
				}
			}
		}
	
	}
]);	


app.provider('gmailService', [ function (){
		/*request types param filler*/
		var getRequestParams =  ( function( type, queryParams ){
			var params = {};
			if (queryParams == undefined){
				 queryParams = {};
			}
			switch ( type ) {
				case 'list': 
				params = 
					{ 
						method 	: 'get',
						url		: 'https://www.googleapis.com/gmail/v1/users/me/messages',
						params  : queryParams,
						
					}
				break;
			}
			return params;
		});
		
		
		
		
		return {
			$get: function($http){
				var _token  = null;
				var gWrap = gmailAuthWrapper();
				gWrap.parseResponse();
				_token =  gWrap.checkState();
				
				var _sendRequest = ( function ( type, params, callback ){
					var requestParams = getRequestParams ( type, params );
					var _callback = callback;
					//adding access_token param to params
					requestParams.params['access_token'] = _token;
					//sending request
					$http( requestParams).success( 
						function(data){
							_callback( data );
							console.log(data);
						}
					);
				});
				
				return{
					getToken: function(){
						return _token;
					},
					sendRequest: function(type, params, callback){
						_sendRequest( type, params, callback);
						
					}
					
				}
			}
		}
	
	}
]);	
