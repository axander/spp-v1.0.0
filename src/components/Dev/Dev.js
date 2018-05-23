import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import DevPB from './DevPB.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
// The Header creates links that can be used to navigate
// between routes.

class Dev extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	'show': '',
        	'toogle':false,
        	'value':'Lot of text'
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
	clickHandler(){
		if(!this.state.toogle || this.state.show === '' ){
			this.state.toogle = true
			this.setState({
			    'show': 'showMenu',
			    'value': JSON.stringify(localStorage, undefined, 2)
			}),
			document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
		}else if(this.state.toogle ){
			this.state.toogle = false;
			this.setState({
			    'show': '',
			    'value': JSON.stringify(localStorage, undefined, 2)
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
	    if (!domNode || ( domNode.contains ==='function' && !domNode.contains(event.target))) {
	        this.setState({
			    'show': ''
			 });
	    }
	    document.getElementById('root').removeEventListener('click', this.handleClickOutside, true);
	}
  	render() {
	  	return(
	  		<div onClick={ this.clickHandler } >
		  		<DevPB ></DevPB>
		  		<console id="menuContainer" className={this.state.show } >
			    	<div className="scrollCont" >
			    		<div className="scrollableCont" >
					        <textarea value={this.state.value} />
					    </div>
				    </div>
				</console>
				
			</div>
	  	)
	  }
}
Dev.propTypes = {
  //who: React.PropTypes.string.isRequired,
};

// Returns nothing because it mutates the class
TranslatedComponent(Dev);
export default Dev