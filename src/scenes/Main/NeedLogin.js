import React from 'react'
import { Switch, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import './NeedLogin.scss'


class NeedLogin extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {}
	  }
	  componentDidMount(){
	    this.setState({
	      'style':{
	        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
	      }
	    })
	  }
	  render() {
	    return (
	      <div className='needLogin' style={this.state.style}>
	        Necesitas estar logado para poder visualizar este contenido
	      </div>
	    );
	  }
}

NeedLogin.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(NeedLogin);
export default NeedLogin;