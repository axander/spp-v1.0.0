import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import Claim from '../Claim/Claim.js'
import Utils from '../../utils/Utils.js'
import './Listened.scss'

class Listened extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'init':true,
      'loading':true,
      'error':false,
      'focusItem':JSON.parse(localStorage.getItem('lastItemDatastatic'))
    }
    this.onSuccessOrigen = this.onSuccessOrigen.bind(this);
    this.getOrigen = this.getOrigen.bind(this);
  }
  onSuccess = (_response) => {
    _response.status === 'success'
    ? (
        this.setState({
          'init':false,
          'loading':false,
          'error':false,
          'perPhase':_response.perPhase,
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
  getOrigen(){
    Utils.scrollToTop(300);
    window.setSpinner();
    API.action('getPodcastOrigen', { 'id' : this.state.focusItem.id }, this.onSuccessOrigen, this.onError, 'GET', false, true);
  }
  onSuccessOrigen = (_response) => {
    _response.status === 'success'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setOrigen(_response){
    localStorage.setItem('lastPosition',_response.position % _response.perPhase);//indicates the position
    localStorage.setItem('lastItemDataepisode',JSON.stringify(_response.data.podcast));
    localStorage.setItem('phase_podcast_'+_response.data.podcast.id, Math.trunc(_response.position / _response.perPhase));
    localStorage.setItem('lastpodcast',_response.data.podcast.id);
    localStorage.setItem('podcast',JSON.stringify(_response.data.podcast));
    localStorage.setItem('lastpodcastName',_response.data.podcast.name);
    localStorage.setItem('lastpodcastLink','/episode/'+_response.data.podcast.id+'/'+_response.data.podcast.name);
    localStorage.setItem('lastChannel',_response.data.channel.id);
    localStorage.setItem('lastChannelData',JSON.stringify(_response.data.channel));
    localStorage.setItem('lastChannelLink','/podcast/'+_response.data.channel.id+'/'+_response.data.channel.name);
    localStorage.setItem('lastChannelName',_response.data.channel.name);
    localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response.data.channel));
    localStorage.setItem('phase_opinion_'+_response.data.podcast.id, 0);
    window.location.href = './#/episode/'+_response.data.podcast.id+'/'+_response.data.podcast.name;
    
  }
 
  getItem(_item){
    event.stopPropagation();
    /*this.props.auth.isAuthenticated
    ? this.getOrigen()
    : (
      localStorage.setItem('staticNotLogged', true),
      localStorage.setItem('lastItemDatastatic', JSON.stringify(_episode)),
      this.props.auth.required()
    )*/
    this.setState({
      'focusItem':_item
    });
    localStorage.setItem('lastItemDatastatic', JSON.stringify(_item));
    this.getOrigen();
  }
  componentDidMount(){
    localStorage.getItem('staticNotLogged')
      ? (
        localStorage.removeItem('staticNotLogged'),
        this.getOrigen()
      )
      
      : API.action('getMostListened', {}, this.onSuccess, this.onError, 'get' , false , true);
      
  }
  render() {
    var lan = localStorage.getItem('language');
    if(typeof this.state.data !== 'undefined'){
      var collection = [];
      if( Object.prototype.toString.call( this.state.data ) === '[object Array]' ) {
          collection = this.state.data;
      }else{
        for( var j in this.state.data){
            collection.push(this.state.data[j]);
        }
      }
      this.props.auth.typeUser !== 'premium'
      ? collection = collection.slice(0,4)
      : collection = collection.slice(0,6)
    }else{
      collection = [];
    }
    let ClaimDiv;
    localStorage.getItem('logged') && localStorage.getItem('client') && JSON.parse(localStorage.getItem('client')).personalData.type === 'basic'
    ? ClaimDiv = <div className="col-xs-12 col-sm-4" >
        <Claim />
      </div>
    : this.props.auth.typeUser !== 'premium'
      ? ClaimDiv = <div className="col-xs-12 col-sm-4" >
          <div id='right1' >
           
          </div>
        </div>
      : ClaimDiv = '';
    return (
      <div className='most_listened' >
        <div className='row'>
          <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-sm-8" : "col-xs-12" } >
            <h1>{this.translate('blocks.listened')}</h1>
            <div className={this.props.auth.typeUser !=='premium' ? 'most_listened_episodes' : 'most_listened_episodes_premium'}  >
              {collection.map(( p , index) => {
                return (
                  <div>
                    <div className={this.props.auth.typeUser !=='premium' ? "most_listened_item" : "col-md-4 most_listened_item" }  style={'background-image:url("' + this.state.cms + p.image + '")'} onClick={(episode) => this.getItem(p)} >
                      {/*<div className="most_listened_item_content" >
                        <div className='most_listened_item_item_PB'>
                          <div className='most_listened_item_item_PB_deco'>
                            <div>&#9658;</div>
                          </div>
                        </div>
                      </div>*/}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {ClaimDiv}
        </div>
        {/*<a href={adv.externalLink} target='_blank' className={ typeof this.state.data === 'undefined' || !adv.externalLink || adv.externalLink.length<=0  ? 'hide':'' } ><div className='most_listened_ads' style={'background-image:url("' + adv.image + '")'}></div></a>
        <Link to={'/'+adv.route} className={ typeof this.state.data === 'undefined' || !adv.route || adv.route.length<=0  ? 'hide':'' } ><div className='most_listened_ads' style={'background-image:url("' + adv.image + '")'}></div></Link>*/}
        <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
        <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );
  }
}

Listened.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Listened);
export default Listened;