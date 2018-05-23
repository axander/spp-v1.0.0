import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { Modal, API } from '../../services/Rest.js'
import SettingsPB from './SettingsPB.js'
import TranslationPicker from '../TranslationPicker.js';
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import Device from '../../utils/Device.js';
// The Header creates links that can be used to navigate
// between routes.

class Settings extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	'show': '',
        	'toogle':false,
        	'logout': this.props.logout.isAuthenticated || localStorage.getItem('logged') ? 'showLogOut' : 'hideLogOut'
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.changeToApp = this.changeToApp.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
    }
    changeToApp(e){
    	localStorage.getItem('app') ? localStorage.removeItem('app') : localStorage.setItem('app', true);
    	location.reload();
    }
    changeTheme(e){
    	localStorage.getItem('template') === 'dark' ? localStorage.setItem('template','light') : localStorage.setItem('template','dark');
    	/*localStorage.setItem('app', true);*/
    	location.reload();
    }
	clickHandler(e){
		if(!this.state.toogle || this.state.show === '' ){
			this.state.toogle = true
			this.setState({
			    'show': 'showMenu',
			    'logout': this.props.logout.isAuthenticated || localStorage.getItem('logged') ? 'showLogOut' : 'hideLogOut' 
			}),
			document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
		}else if(this.state.toogle ){
			this.state.toogle = false;
			this.setState({
			    'show': '',
			    'logout': this.props.logout.isAuthenticated || localStorage.getItem('logged') ? 'showLogOut' : 'hideLogOut' 
			});
			document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
		}
		e.target.id === 'logoutPB'
		? ( window.setSpinner() , API.action('logout', this.state, this.logout, this.onError) )
		: null;
    }
    onError = (_response, _error) =>{
    	this.setState({
          isOpen: true,
          showedMsg: _error
      	});
    }
    logout = (_response) => {
    	_response.status === 'successfull'
    	? ( localStorage.removeItem('logged'), localStorage.removeItem('token'),
			localStorage.removeItem('client'),
			typeof localStorage.getItem('extStatus') !== 'undefined' && JSON.parse(localStorage.getItem('extStatus')) && JSON.parse(localStorage.getItem('extStatus')).authResponse && JSON.parse(localStorage.getItem('extStatus')).authResponse.accessToken ? window.logoutFb() : null,
			this.props.logout.signout() ,
			document.getElementById('root')['submenu'].handler = null
			)
    	: this.setState({
          isOpen: true,
          showedMsg: 'user.logout.error.'+_response.reason
      	});
    }
    componentWillUpdate() {
    	localStorage.getItem('proccessing') === 'logingOut'
    	? (
    		localStorage.removeItem('proccessing'),
    		this.props.logout.signout()
    	)
    	: null;
	}
	componentWillUnmount() {
	    document.getElementById('root').removeEventListener('click', this.handleClickOutside, true);
	}
	handleClickOutside(event) {
	    const domNode = ReactDOM.findDOMNode(this);
	    if (!domNode || !domNode.contains(event.target)) {
	        this.setState({
			    'show': ''
			 });
	    }
	    document.getElementById('root').removeEventListener('click', this.handleClickOutside, true);
	}
  	render() {
	  	return(
	  		<div onClick={ this.clickHandler } >
	  			
		  		<SettingsPB ></ SettingsPB>
		  		<menuOptions 
		  			className={
						this.state.show 
	      			} 
	      		>
	      			<nav>
	      				<div className="scrollCont" >
				    		<div className="scrollableCont" >
				    			<div className="toApp">X</div>
				    			<div className="toApp" onClick={this.changeToApp} >App</div>
				    			<div className="toApp" onClick={this.changeTheme} >Change Theme</div>
				    			<Link to='/logout' id='logoutPB' className={this.state.logout} >Log Out</Link>
				    			<TranslationPicker />
				        		<Link to='/user'><div className={ Utils.checkScene('/user') ? 'opSelected' : 'opNoSelected' } >{this.translate('menu.user')}</div></Link>
				        		<Link to='/terms'><div className={ Utils.checkScene('/terms') ? 'opSelected' : 'opNoSelected' } >{this.translate('terms')}</div></Link>
				        		<div className='deviceInfo' >{ Device.na }
						        </div>
				        		<div className='deviceInfo' >{
						            Device.data.map( p => (
						              <div>
						     			<span className='rot' >{p.name}: </span>{p.value}
						              </div>
						            ))
						          }
						        </div>
				        	</div>
				        </div>
				    </nav>			    
				</menuOptions>
				
			</div>
			
	  	)
	  }

}
Settings.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Settings);
export default Settings