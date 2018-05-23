import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../../blocks/Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../../blocks/Common/LocalError/LocalError.js'
import List_web from '../../components/Lists/List_web.js'
import './Shared_web.scss'

class Shared_web extends React.Component {
  constructor(props) {
    localStorage.setItem('lastState',props.location.pathname);
    super(props);
    this.state={
    }
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount(){
    window.setSpinner();
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize() {
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
  }
  render() {
    return (
      <div className='shared_web' style={this.state.style} >
                <h1>Shared</h1>
                <List_web type="Shared" auth={this.props.auth} initplayer={this.props.initplayer}  />
      </div>
    );
  }
}

Shared_web.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Shared_web);
export default Shared_web;