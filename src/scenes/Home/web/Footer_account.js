import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './styles/footer_web.scss'

class Footer_account extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentDidUpdate(){
    
  }

  render() {
    return (
      <div>
        <h1>{this.translate('legal').toUpperCase()}</h1>
        <div><Link to={'/info/legal'} ><div>{this.translate('footer.legal')}</div></Link></div>
        <div><Link to={'/info/privacity'} ><div>{this.translate('footer.privacityTerms')}</div></Link></div>
        <div><Link to={'/info/cookies'} ><div>{this.translate('footer.cookiesTerms')}</div></Link></div>
      </div>  
    );
  }
}

Footer_account.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Footer_account);
export default Footer_account;