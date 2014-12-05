var app = angular.module('mailApp',[]);
app.controller('mainCtrl',['gmailService', '$scope', '$http', '$window',
	function(gmailService, $scope, $http, $window ){
	
		
		$scope.token = gmailService.getToken();
		$scope.loadEmails = (function(){
			gmailService.sendRequest('list');
		});
		
		
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
		});
		
		
		
		
		return {
			$get: function($http){
				var _token  = null;
				var gWrap = gmailAuthWrapper();
				gWrap.parseResponse();
				_token =  gWrap.checkState();
				
				var _sendRequest = ( function ( type, params ){
					var requestParams = getRequestParams ( type, params );
					
					//adding access_token param to params
					requestParams.params['access_token'] = _token;
					//sending request
					$http( requestParams).success( 
						function(data){
							console.log(data);
						}
					);
				});
				
				return{
					getToken: function(){
						return _token;
					},
					sendRequest: function(type, params){
						_sendRequest( type, params);
						
					}
					
				}
			}
		}
	
	}
]);	
