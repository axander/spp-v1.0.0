import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import Utils from '../../utils/Utils.js'
import './Travel.scss'

class Travel extends React.Component {
  constructor(props) {
    super(props);
    console.log('travel');
    console.log(props);
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
    console.log(_response);
    _response.status === 'success'
    ? (
        this.setState({
          'init':false,
          'loading':false,
          'error':false,
          'data':_response.result,
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
    this.getOrigen()
  }
  componentDidMount(){
      localStorage.getItem('staticNotLogged')
      ? (
        localStorage.removeItem('staticNotLogged'),
        this.getOrigen()
      )
      
      : API.action('getFeatured', {}, this.onSuccess, this.onError, 'get', false, true);
      //API.action('getTravel', {}, this.onSuccess, this.onError, 'get', false, true);
  }
 
  render() {
    var lan = localStorage.getItem('language');
    if(typeof this.state.data !== 'undefined'){
      var collection = this.state.data;
      collection.col = [];
      collection.col.push(this.state.data.podcast1);
      collection.col.push(this.state.data.podcast2);
      collection.col.push(this.state.data.podcast3);
    }else{
      collection = null
    }
    /*if(typeof this.state.data.style !== 'undefined'){
      var bg = this.state.data.style.image;
    }else{
      bg = '';
    }*/
    return (
      <div className='travel' >
        {/*<div className='travel_episodes' style={'background-image:url("' + bg + '")'}>*/}
        { 
          this.state.data
          ? <div className='travel_episodes' style={'background:'+this.state.data.bgcolor+';background-image:url("' + this.state.cms + this.state.data.bgimage + '")'} >
              <div className='travel_episodes_tittle' style={'color:'+this.state.data.fontcolor}  >{this.state.data.title}</div>
              <div className='travel_episodes_content'>
                {collection.col.map(( p , index) => {
                  return (
                    <div className="travel_item" style={'background-image:url("' + this.state.cms + p.image + '")'} onClick={(episode) => this.getItem(p)} >
                      {/*<div className="travel_item_content" >
                        <div className='travel_item_item_PB'>
                          <div className='travel_item_item_PB_deco'>
                            <div>&#9658;</div>
                          </div>
                        </div>
                      </div>*/}
                    </div>
                  )
                })}
              </div>
            </div>
          : ''
        }
        <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
        <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );
  }
}

Travel.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Travel);
export default Travel;