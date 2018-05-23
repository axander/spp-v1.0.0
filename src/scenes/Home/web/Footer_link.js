import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './styles/footer_web.scss'

class Footer_link extends React.Component {
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
        <h1>{this.translate('footer.links').toUpperCase()}</h1>
        <div><Link to={'/info/help_center'} ><div>{this.translate('footer.help')}</div></Link></div>  
        <div><Link to={'/explorar'} ><div>{this.translate('footer.explore')}</div></Link></div>  
        <div><Link to={'/register'} ><div>{this.translate('header.register')}</div></Link></div>  
        <div className='footer-init-session' ><div onClick={this.props.header.initSession} >{this.translate('header.initSession')}</div></div>
      </div>  
    );
  }
}

Footer_link.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Footer_link);
export default Footer_link;