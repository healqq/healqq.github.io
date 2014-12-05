var app = angular.module('mailApp',[]);
app.controller('mainCtrl',['gmailService', '$scope', '$http', '$window',
	function(gmailService, $scope, $http, $window ){
	
		
		$scope.token = gmailService.getToken();
		
		
	}	
]);

app.provider('gmailService', [ function (){
		
		var sendRequest =  ( function( type){
		});
		
		
		return {
			$get: function($http){
				var _token  = null;
				var gWrap = gmailAuthWrapper();
				gWrap.parseResponse();
				_token =  gWrap.checkState();
				
				return{
					getToken: function(){
						return _token;
					},
					sendRequest: function(){
					}
					
				}
			}
		}
	
	}
]);	
