import "isomorphic-fetch"
import { polyfill } from 'es6-promise'; polyfill();
import React from 'react'
import List from './List.js'
import Utils from '../utils/Utils.js'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../utils/TranslatedComponent.js'

const API = {
	action: function(_path, _params, _onSuccess, _onError, _singleMethod, _singleMock, _singleReal, _param){
		//
		var fullUrl = _path.indexOf('http');
		var url = '';
		if( fullUrl < 0 && List[_path].service === 'config'){
			url = List[_path].service + '.json';//get config
			var _method  = List[_path].method;
		}else{
			var extraParam = '';
			_param
			? extraParam = '/'+_param.param
			: null;
			var config = JSON.parse(localStorage.getItem('config'));
			fullUrl >= 0 
			? url = _path
			: url =  !_singleReal && ( config.mocks || _singleMock )
						? config.mocksPath+List[_path].service+'.json'
						: config.endpoint+config.partialPath+List[_path].service+extraParam;
			_singleMethod && !_singleReal
			? _method = _singleMethod
			: _method  = ( !_singleReal && ( config.mocks || _singleMock ) ) ? 'GET' :List[_path].method;
		};
		//_method === 'GET' && List[_path].service !== 'config' ? url+"?"+Utils.formatGetParameters(_params) : url , 
		fetch(
			_method === 'GET' && List[_path].service !== 'config' ? url+"?"+Utils.formatGetParameters(_params) : url , 
			{
				/*mode: 'no-cors',*/
				'username':'nginx',
				'password':'spainmedia',
		      	method: _method,
		      	headers: url.indexOf('.json')<0 && List[_path].service !== 'config' && localStorage.getItem('api_key') && fullUrl < 0 ? new Headers({
		      			'Access-Control-Allow-Origin': '*',
		      			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
		      			'Cache-Control': 'cache',
		      			'Accept':'*/*',
		                'Content-Type': '*/*', // <-- Specifying the Content-Type
		                'Authorization': localStorage.getItem('api_key'),
		                'Content-Type': 'application/json'
		        }) : new Headers({
		        		'Access-Control-Allow-Origin': '*',
		        		'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
		        		'Cache-Control': 'cache',
		        		'Accept':'*/*',
		                'Content-Type': '*/*', // <-- Specifying the Content-Type
		                'Content-Type': 'application/json',
		                'Authorization' : 'Basic bmdpbng6c3BhaW5tZWRpYQ=='
		        }),
		      	body: _method === 'POST' ? JSON.stringify(_params) : undefined // <-- Post parameters
		    }
		)
	    .then(function(response) {
    		if (response.status >= 400) {
    			window.setSpinner();
		    	_onError(response, 'warning');
		    }
		    return response.json();
		})
		.then(function(data) {
			if(typeof List[_path] !== 'undefined' && List[_path].service === 'config'){
				data.data.token ? localStorage.setItem('token',data.data.token) : null;
				localStorage.setItem('config',JSON.stringify(data.data));
				console.log('response service1');
				console.log(data);
				_onSuccess(data);	
			}else{
				console.log('response service2');
				console.log(data);
				data.error !== "Unauthorized"
				? (
					window.setSpinner(),
		    		_onSuccess(data)	
		    	)
		    	: (
		    		localStorage.clear(),
		    		localStorage.setItem('sesion','timeout'),
		    		window.logoutFb(),
		    		window.location.href = '#/'/*,
		    		window.location.reload()*/
		    	)
			}

		})
	    .catch((error) => {
	    	window.setSpinner();
	    	_onError(error, 'critical');
	    })
	}
}


class Modal extends React.Component {
	setLink(){
		localStorage.getItem('modalToExplore')
		? (
			window.location.href = './#/'+localStorage.getItem('modalToExplore'),
			localStorage.removeItem('modalToExplore')
		)
		:null
	}
  	render() {
    // Render nothing if the "show" prop is false
	    if(!this.props.show) {
	      return null;
	    }
	    let  goPremium
	    localStorage.getItem('goPremium')
	    ? (
	    	goPremium = <Link to='/premium' >
		    				<button className='goPremium'>
				                {this.translate('user.toPremium')}
				            </button>
				        </Link>
	    	
	    )
	    : goPremium = ''

	    return (
	      <div className="backdropContainer" onClick={this.props.onClose}>
	        <div className="backdrop" onClick={this.setLink}>
	          <div className="modal" >
	            <div className="modal-contain">
	              <p>{this.props.children}</p>
	            </div>
	            <div className="modal-footer">
	             {goPremium}
	              <button className={localStorage.getItem('goPremium') ? 'resetClose' : ''} onClick={this.setLink} >
	                {this.translate('continue')}
	              </button>
	            </div>
	          </div>
	        </div>
	      </div>
	    );
  	}
}

Modal.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Modal);


module.exports = {
  Modal,
  API
}