import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import './Info.scss'

class Legal extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem('lastState',props.location.pathname);
  }
  componentDidMount() {
    // Will execute as normal
    document.querySelector('#content-info').innerHTML = this.props.statics.content;
  }
  
  render() {
    return (
      <div className='mainContainer' >
            <div className="info_static">
              <h1>{this.props.statics.title}</h1>
              <div id='content-info'></div>
            </div>
      </div>
    );
  }
}

Legal.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Legal);
export default Legal;