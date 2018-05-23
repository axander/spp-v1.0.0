import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import DownApple from '../../components/App/Buttons/DownApple.js';
import DownAndroid from '../../components/App/Buttons/DownAndroid.js';
import './Claim.scss'

class Claim extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'init':true,
      'loading':true,
      'error':false,
      'data':{}
    }
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
  componentDidMount(){
      API.action('getClaim', {}, this.onSuccess, this.onError, 'get', false, true);
  }
  render() {
    var lan = localStorage.getItem('language');
    if(typeof this.state.data !== 'undefined'){
      var subscription = 
        <div style={'background:' + this.state.data.bgcolor }>
              <div className='claim_subscription_title' style={'color:' + this.state.data.fontcolor } >{this.state.data.small_title}</div>
              <div className='claim_subscription_subtitle' style={'color:' + this.state.data.fontcolor } >{this.state.data.small_subtitle}</div>
              <a href={this.state.data.externalLink} target='_blank' className={typeof this.state.data.externalLink === 'undefined' || this.state.data.externalLink.length <= 0 ? 'hidden':'' } ><div className='claim_subscription_PB' >
                  <span>{this.state.data.small_btn_title}</span>
              </div></a>
              <Link to={'/'+this.state.data.small_btn_url} className={typeof this.state.data.small_btn_url === 'undefined' || this.state.data.small_btn_url.length <= 0 ? 'hidden':'' } ><div className='claim_subscription_PB' >
                  <span>{this.state.data.small_btn_title}</span>
              </div></Link>
        </div>
    }else{
      subscription ='';
    }
    return (
      <div className='claim' >
                <div className='claim_subscription'>
                  {subscription}
                </div>
                <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
                <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );
  }
}

Claim.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Claim);
export default Claim;