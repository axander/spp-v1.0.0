import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './styles/footer_web.scss'
import Logo from '../../../components/Logo/Logo.js'

class Footer_generic extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentDidUpdate(){
    
  }

  render() {
    return (
      <div className={ 'footer_web_generic footer_web_generic_'+localStorage.getItem('template')}>
        <a href='http://spainmedia.es' target='_blank' ><Logo /></a>
      </div>  
    );
  }
}

Footer_generic.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Footer_generic);
export default Footer_generic;