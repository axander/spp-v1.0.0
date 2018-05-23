import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './styles/footer_web.scss'

import Footer_about from './Footer_about.js'
import Footer_account from './Footer_account.js'
import Footer_link from './Footer_link.js'
import Footer_app from './Footer_app.js'
import Footer_generic from './Footer_generic.js'
import Footer_copyright from './Footer_copyright.js'

import facebook_dark from '../../../assets/images/facebook_dark.png'
import youtube_dark from '../../../assets/images/youtube_dark.png' 
import twitter_dark from '../../../assets/images/twitter_dark.png' 
import instagram_dark from '../../../assets/images/instagram_dark.png' 
import facebook_light from '../../../assets/images/facebook_light.png'
import youtube_light from '../../../assets/images/youtube_light.png' 
import twitter_light from '../../../assets/images/twitter_light.png' 
import instagram_light from '../../../assets/images/instagram_light.png' 

class Footer_web extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentDidUpdate(){
    
  }

  render() {
    return (
      <div className={ 'footer_web footer_web_'+localStorage.getItem('template')} >
        <div class='row row-eq-height' >
          <div className={'col-xs-6 col-md-3 footer_web_block footer_web_block_'+localStorage.getItem('template')}><div><div><Footer_about /></div></div></div>
          <div className={'col-xs-6 col-md-3 footer_web_block footer_web_block_'+localStorage.getItem('template')}><div><div><Footer_account /></div></div></div>
          <div className={'col-xs-6 col-md-3 footer_web_block footer_web_block_'+localStorage.getItem('template')}><div><div><Footer_link header={this.props.header} /></div></div></div>
          <div className={'col-xs-6 col-md-3 footer_web_block footer_web_block_'+localStorage.getItem('template')}><div><div><Footer_app /></div></div></div>
        </div>
        <div class='row row_social'> 
          <div class='col-xs-12 col-md-offset-9 col-md-3 footer_web_block'>
            <div className="social_adjust_responsive" >
              <h1 className="social_container_rot">{this.translate('footer.followus').toUpperCase()}</h1>
              <div className="social_container" >
                <div className={ 'social social'+localStorage.getItem('template')} ><img src={ localStorage.getItem('template') === 'dark' ? youtube_light : youtube_dark } alt="youtube" /></div>
                <div className={ 'social social'+localStorage.getItem('template')} ><img src={ localStorage.getItem('template') === 'dark' ? instagram_light : instagram_dark } alt="instagram" /></div>
                <div className={ 'social social'+localStorage.getItem('template')} ><img src={ localStorage.getItem('template') === 'dark' ? twitter_light : twitter_dark } alt="twitter" /></div>
                <div className={ 'social social'+localStorage.getItem('template')} ><img src={ localStorage.getItem('template') === 'dark' ? facebook_light : facebook_dark } alt="facebook2" /></div>
              </div>
            </div>
          </div>
        </div>
        <div class='row'>
          <div class='col-xs-12 col-lg-12'><Footer_generic /></div>
        </div>
        <div class='row'>
          <div class='col-xs-12 col-lg-12 '><Footer_copyright /></div>
        </div>
      </div>  
    );
  }
}

Footer_web.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Footer_web);
export default Footer_web;