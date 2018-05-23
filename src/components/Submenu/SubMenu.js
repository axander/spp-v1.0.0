import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import UsuarioApi from '../../services/api2.js'
import SubMenuPB from './SubMenuPB.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';

// The Header creates links that can be used to navigate
// between routes.

class Submenu extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	'sub':props.sub,
        	'show': '',
        	'toogle':false
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
	clickHandler(){
		if(!this.state.toogle || this.state.show === '' ){
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
    componentDidMount() {
    	
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
		  		<SubMenuPB ></ SubMenuPB>
		  		<menuOptions 
		  			className={
						this.state.show 
	      			} 
	      		>			    
				    <nav>
				    	<div className="scrollCont" >
				    			<div className="scrollableCont" >
								    {
								        UsuarioApi.all(this.state.sub).map(p => (
								            <Link key={p.id} to={this.state.sub+'/'+p.id}><div  className={ Utils.checkScene(p.sub+'/'+p.id) ? 'opSelected' : 'opNoSelected' } >{this.translate(p.sub.replace('/','')+'.'+p.id)}</div></Link>
								        ))
								    }
								</div>
						</div>
				    </nav>

				</menuOptions>
				
			</div>
	  	)
	  }
}
Submenu.propTypes = {
  //who: React.PropTypes.string.isRequired,
};
TranslatedComponent(Submenu);
export default Submenu

