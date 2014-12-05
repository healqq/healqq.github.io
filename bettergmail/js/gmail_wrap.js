var gmailWrapper = ( function(){
	
	//google app params
	var scope = 'email%20profile%20https://www.googleapis.com/auth/gmail.modify';
	var clientId = '431831242446-c651r3f8nd3kaide989r7goilfbrkeu5.apps.googleusercontent.com';
	//user info
	var validationInfo = null;
	
	//auth response object
	
	
	var parseParams =( function(){
		
		var responseObject = {};
		var query = window.location.hash;
		var response = false;
		var validationInfo = null;
		var tokens = [];
		if ( query !== ''){
			response = true;
			var response = query.substr(1).split('&');
			for ( var i=0; i< response.length; i++){
				tokens = response[i].split('=');
				responseObject[tokens[0]] = tokens[1];
				
			}
			console.log(responseObject);
			window.location.hash = '';
			validateToken(responseObject.access_token);
		}
		return response;
		
	});
	var auth =( function(){
		window.location.href ='https://accounts.google.com/o/oauth2/auth?\
			scope='+scope+'&\
			state=%2Fprofile&\
			redirect_uri=http://healqq.github.io/bettergmail/&\
			response_type=token&\
			client_id='+clientId;
	});
	var validateToken = ( function(token){
		$.post('https://www.googleapis.com/oauth2/v1/tokeninfo',
			{
				access_token: token 
			}
		).done(function(data){
			validationInfo = data;
			sessionStorage.setItem('token', token);
			console.log( data );
		})
	});
	
	var checkState = ( function(){
		var token = sessionStorage.getItem('token');
		
		if (token === null){
			//not authorised
			auth();
		}
		else{
			validateToken(token);
		}
	});
	return {
		checkState: checkState,
		parseResponse: parseParams
	}
	
});