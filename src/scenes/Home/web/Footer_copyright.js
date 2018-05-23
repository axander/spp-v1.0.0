import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './styles/footer_web.scss'

class Footer_copyright extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentDidUpdate(){
    
  }

  render() {
    return (
      <div className={ 'footer_web_copyright footer_web_copyright_'+localStorage.getItem('template')}>
        <div>{this.translate('footer.copyright')}</div>
      </div>  
    );
  }
}

Footer_copyright.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Footer_copyright);
export default Footer_copyright;