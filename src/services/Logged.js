import Utils from '../utils/Utils.js'


const Logged = {
	setAuthRefresh : function(){
		var set = false;
		localStorage.getItem('logged') && JSON.parse(localStorage.getItem('client')) && JSON.parse(localStorage.getItem('client')).personalData.email === localStorage.getItem('email')
		? set = true
		: null;
		return set
	},
	getLogged : function(_props, _auth){
		if(localStorage.getItem('logged')){
			_auth.typeUser = JSON.parse(localStorage.getItem('client')).personalData.type
			return true
		}else{
			if(!localStorage.getItem('logged') && localStorage.getItem('extStatus') && JSON.parse(localStorage.getItem('extStatus')).status ==='connected'){
				var config = JSON.parse(localStorage.getItem('config'));
				var _url = config.mocks ? config.mocksPath+'user/loginExt.json' : config.endpoint+config.partialPath+'user/loginExt';
				var _method = config.mocks ? 'GET' : 'POST';
				var _body = JSON.parse(localStorage.getItem('extStatus'));
				if(!config.extLogin){
					localStorage.setItem('error', 'ERROR.loginExternal');
			    	localStorage.removeItem('logged');
			    	window.logoutFb();
			    	//window.location.href='#/Login';
				}else{
					fetch(
						_url  , 
						{
					      	method: _method,
					      	headers: new Headers({
					      			'Accept':'*/*',
					                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
					        }),
					      	body: _method === 'POST' ? Utils.formatGetParameters(_body) : undefined // <-- Post parameters
					    }
					)
				    .then(function(response) {
			    		if (response.status >= 400 ) {
			    			window.setSpinner();
			    			localStorage.setItem('error', 'ERROR.loginExternal');
			    			localStorage.removeItem('logged');
			    			window.logoutFb();
			    			return false
					    }else{
					    	return response.json();
					    }
					})
					.then(function(data) {
						window.setSpinner();
						data.status==='success'
						? ( localStorage.setItem('logged',true),
							localStorage.setItem('client',JSON.stringify(data.data)),
      						localStorage.setItem('token',data.token),
      						_auth.isAuthenticated = true,
		    				_auth.setUser(data.data.personalData.type),
		    				window.location.href='#'+_props.location.pathname
		    			)
		    			: window.logoutFb();
		    			
					})
				    .catch((error) => {
				    	/*window.setSpinner();
				    	localStorage.setItem('error', 'ERROR.loginExternal')
				    	localStorage.removeItem('logged');
				    	window.logoutFb();*/
				    	return false
				    })
				}
				
			}else{
				return false
			}
		}
	}
}

export default Logged