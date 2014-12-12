var app = angular.module('mailApp',[]);
app.controller('mainCtrl',['gmailService', 'dataService', '$scope', '$http', '$window',
	function(gmailService, dataService, $scope, $http, $window ){
	
		
		$scope.token = gmailService.getToken();
		$scope.loadEmails = (function(){
			gmailService.sendRequest('list', {}, dataService.setEmailsList);
			console.log ( dataService.getEmailsList() );
		});
		
		
	}	
]);


app.provider('dataService', [  function (){
		/*request types param filler*/
		
		
		
		
		
		return {
			$get: function(gmailService){
				var _list = {};
				
				var loadEmailContents = ( function( id ){
					gmailService.sendRequest('contents',{id:id}, _setEmailContents);
				});
				
				var _setEmailContents = ( function(contents, id){
					if ( id == undefined){
						id = contents.id;
					}
					_list[id].contents = contents;
					
				});
				return{
					setEmailsList: function( data){
						for (var i=0; i< data.messages.length; i++ ){
							_list[data.messages[i].id] = {loaded: false}; 
						}
					},
					getEmailsList: function(){
						return _list;
						
					},
					setEmailContents: _setEmailContents,
					getEmailContents: function( id ) {
						return _list[id];
					}
					
				}
			}
		}
	
	}
]);	


app.provider('gmailService', [ function (){
		/*request types param filler*/
		var getRequestParams =  ( function( type, queryParams ){
			var id = undefined;
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
				case 'contents': 
				id = queryParams.id;
				delete queryParams.id;
				params = 
					{ 
						method 	: 'get',
						url		: 'https://www.googleapis.com/gmail/v1/users/me/messages/'+id,
						params  : queryParams,
						
					};
					
				//removing params used in path
			
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
