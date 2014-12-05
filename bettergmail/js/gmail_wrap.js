var vkManager = (function(){
	var ready = false;
	var init =( function(){
		if ( VK === undefined){
			 return false;
		}
		VK.init({
			apiId: 4479322
		});
		return true;
	});	
				//checking status
	this.loginStatus = ( function( func ){
		if (ready)
			VK.Auth.getLoginStatus( func );
		}
	);
				//login
	this.login = (function ( func ){
		if (ready)
			VK.Auth.login(func);
		}
	);
				//logout
	this.logout = (function (func ){
		if (ready)
			VK.Auth.logout(func);
		}
	);
				//getting user name
	this.getUserInfo = ( function (uid, func){
		if (ready)
			VK.Api.call('users.get', {uids: uid}, func);
		}
	);
	
	this.getPoll = ( function ( pollId, func){
		if (ready)
			VK.Api.call('polls.getById', {poll_id: pollId}, func);
		}
	);
			
	
	
	//we dont need to reinit this one
	//vkManager = null;
	ready = init();
	return this;	
	// wrap for vk api methods
	//check login status
	
});