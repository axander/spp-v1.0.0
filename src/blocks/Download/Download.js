import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import DownApple from '../../components/App/Buttons/DownApple.js';
import DownAndroid from '../../components/App/Buttons/DownAndroid.js';
import './Download.scss'

class Download extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      'init':true,
      'loading':true,
      'error':false,
      'data':{}
    }
    this.getPremium = this.getPremium.bind(this);
  }
  onSuccess = (_response) => {
    _response.status === 'success'
    ? (
        this.setState({
          'init':false,
          'loading':false,
          'error':false,
          'data':_response.result
        })
      )
    : (
        this.setState({
          'init':false,
          'loading':false,
          'error':true
        })
      );
  }
  onError = (_response, _error) =>{
    this.setState({
          'init':false,
          'loading':false,
          'error':true
        })
  }
  goPremium(){
    window.location.href = '/#/premium';
  }
  getPremium(_url){
    window.location.href = './#/'+_url;
    /*this.props.auth.isAuthenticated
    ? this.goPremium()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.goPremium)
     )*/
  }
  componentDidMount(){
      typeof this.props.mini !== 'undefined'
      ?  this.setState({
          'init':false,
          'loading':false,
        })
      : this.props.auth.isAuthenticated && this.props.auth.typeUser === 'premium'
        ? API.action('getClaimPremium', {}, this.onSuccess, this.onError, 'get', false, true)
        : API.action('getClaim', {}, this.onSuccess, this.onError, 'get', false, true);
  }
  render() {
    var lan = localStorage.getItem('language');
    var subscription;
    typeof this.props.mini === 'undefined'
    ? subscription = 
      <div style={'background:'+this.state.data.bgcolor+';color:' + this.state.data.fontcolor } >
            <div className='download_subscription_title' >{this.state.data.title}</div>
            <div className='download_subscription_subtitle'>{this.state.data.subtitle}</div>
            <div className='download_subscription_container_pb' ><div className='download_subscription_PB' onClick={(_url) => this.getPremium(this.state.data.btn_url)}  >{this.state.data.btn_title}</div></div>
            {/*<a href={this.state.data.subscription.externalLink} target='_blank' className={typeof this.state.data.subscription.externalLink === 'undefined' || this.state.data.subscription.externalLink.length <= 0 ? 'hidden':'' } ><div className='download_subscription_PB' >
                <span>{this.state.data.subscription.btnText[lan]}</span>
            </div></a>
            <Link to={'/'+this.state.data.subscription.route} className={typeof this.state.data.subscription.route === 'undefined' || this.state.data.subscription.route.length <= 0 ? 'hidden':'' } ><div className='download_subscription_PB' >
                <span>{this.state.data.subscription.btnText[lan]}</span>
            </div></Link>*/}
      </div>
    : subscription = ''
    /*<div className={this.props.auth.isAuthenticated ? 'download_apps download_apps_single' : 'download_apps' } >*/
    var download = 
    <div className={typeof this.props.mini === 'undefined' ? 'download_apps' : 'download_appsMini' }  >
      <div className='download_deco' ></div>
      <div className='download_apps_content' >
        <div className='download_apps_content_title' >{this.translate('downloads.title')}</div>
        <div className='download_apps_content_subtitle'>{this.translate('downloads.subtitle')}</div>
        <DownApple />
        <DownAndroid />
      </div>
      
    </div>
    return (
      <div className='download' >
        {download}
        <div className='download_subscription'>
          {subscription}
        </div>
        <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
        <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );
  }
}

Download.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Download);
export default Download;