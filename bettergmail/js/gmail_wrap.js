var gmailAuthWrapper = ( function(){
	
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
			sessionStorage.setItem('token', responseObject.access_token);
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
		console.log('validating token');
		$.post('https://www.googleapis.com/oauth2/v1/tokeninfo',
			{
				access_token: token 
			}
		).done(function(data){
			validationInfo = data;
			console.log('validate successful');
			
			console.log( data );
		}).fail( function(jqXHR, status, error){
		// token is outdated/wrong/whatever
			if ( jqXHR.responseJSON.error === 'invalid_token'){
				sessionStorage.removeItem('token');
				auth();
				
			}
		})
	});
	
	var checkState = ( function(){
	
		console.log('checking authorisation');
		var token = sessionStorage.getItem('token');
		
		if (token === null){
			//not authorised
			auth();
		}
		else{
			validateToken(token);
		}
		return token;
	});
	
	
	return {
		checkState: checkState,
		parseResponse: parseParams
	}
	
});