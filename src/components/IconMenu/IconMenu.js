import React from 'react'
import ReactDOM from 'react-dom'
import { Link, Switch, Route } from 'react-router-dom'
import later from '../../assets/images/later.png';
import download from '../../assets/images/download.png';
import fav from '../../assets/images/fav.png';
import history from '../../assets/images/history.png';
import share from '../../assets/images/share.png';
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import './IconMenu.scss'

import Favourites from '../../scenes/Favourites/Favourites.js'
import Downloads from '../../scenes/Downloads/Downloads.js'
import Historial from '../../scenes/Historial/Historial.js'
import Later from '../../scenes/Later/Later.js'
import Shared from '../../scenes/Shared/Shared.js'

// The Header creates links that can be used to navigate
// between routes.

class IconMenu extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	'show': '',
        	'toogle':false
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    clickHandler(e){
    	console.log(e);
    	var target = event.target.className;
    	if( target.indexOf('submenuOp')>-1 || target.indexOf('folder')>-1 ){
    		//do nothing
    	}else if(!this.state.toogle || this.state.show === '' ){
			this.state.toogle = true
			this.setState({
			    'show': 'showMenu'
			}),
			document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
		}else if(this.state.toogle ){
			this.state.toogle = false;
			this.setState({
			    'show': ''
			});
			document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
		}
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
	  		<iconmenu>
		  		<Link to="/favourites"><div className={ Utils.checkScene('/favourites') ? 'icoSelected' : 'icoNoSelected' } ><img src={fav} alt="fav" /></div></Link>
		  		<Link to="/downloads"><div className={ Utils.checkScene('/downloads') ? 'icoSelected' : 'icoNoSelected' } ><img src={download} alt="download" /></div></Link>
		  		<Link to="/later"><div className={ Utils.checkScene('/later') ? 'icoSelected' : 'icoNoSelected' } ><img src={later} alt="later" /></div></Link>
		  		<Link to="/history"><div className={ Utils.checkScene('/history') ? 'icoSelected' : 'icoNoSelected' } ><img src={history} alt="history" /></div></Link>
		  		<Link to="/shared"><div className={ Utils.checkScene('/shared') ? 'icoSelected' : 'icoNoSelected' } ><img src={share} alt="shared" /></div></Link>
		  		<Link to="/user"><div className={ Utils.checkScene('/user') ? 'icoSelected' : 'icoNoSelected' } ><span class="icon-user"></span></div></Link>
		  	</iconmenu>
	  	)
	  }
}
/*<div onClick={ this.clickHandler }>
			  		<div className="pb" ><div className={ Utils.checkScene('/favourites') ? 'icoSelected' : 'icoNoSelected' } ><img src={fav} alt="fav" /></div></div>
			  		<div className="pb" ><div className={ Utils.checkScene('/later') ? 'icoSelected' : 'icoNoSelected' } ><img src={later} alt="later" /></div></div>
			  		<div  className="pb" ><div className={ Utils.checkScene('/shared') ? 'icoSelected' : 'icoNoSelected' } ><img src={share} alt="shared" /></div></div>
			  		<div className="pb" ><div className={ Utils.checkScene('/history') ? 'icoSelected' : 'icoNoSelected' } ><img src={history} alt="history" /></div></div>
			  		<div className="pb" ><div className={ Utils.checkScene('/downloads') ? 'icoSelected' : 'icoNoSelected' } ><img src={download} alt="download" /></div></div>
			  		<listOptions 
			  			className={
							this.state.show 
		      			} 
		      		>
		      			<nav>
		      				<div className="scrollCont" >
					    		<div className="scrollableCont" >
					        		<Switch>
							          	<Route path='/favourites' render={(props) => (
							              <Favourites {...props} initplayer={this.props.initplayer}  />
							            )}/>
							            <Route path='/downloads' component={Downloads} />
							            <Route path='/later' component={Later} />
							            <Route path='/history' component={Historial} />
							            <Route path='/shared' component={Shared} />
							      </Switch>
					        	</div>
					        </div>
					    </nav>			    
					</listOptions>
			  	</div>*/
IconMenu.propTypes = {
  //who: React.PropTypes.string.isRequired,
};
TranslatedComponent(IconMenu);
export default IconMenu

