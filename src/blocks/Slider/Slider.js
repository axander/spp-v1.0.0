import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import './Slider.scss'


class Slider extends React.Component {
  constructor(props) {
    super(props);
    //'fase': localStorage.getItem('lastSliderPos') || 0
    this.state={
      'init':true,
      'loading':true,
      'error':false,
      'data':{},
      'fase': 0,
      'focusItem':localStorage.getItem('notLoggedId'),
      'typeItem':localStorage.getItem('notLoggedType')
    }
    this.clickBallHandler = this.clickBallHandler.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.leftFunction = this.leftFunction.bind(this);
    this.rightFunction = this.rightFunction.bind(this);
    this.onSuccessOrigen = this.onSuccessOrigen.bind(this);
    this.getOrigen = this.getOrigen.bind(this);
    this.arrowLeft = this.arrowLeft.bind(this);
    this.arrowRight = this.arrowRight.bind(this);
  }
  onSuccess = (_response) => {
    this.setState({
      'init':false,
      'loading':false,
      'error':false,
      'data':{
        'collection':_response[0].sliders
      },
      'itemStyle':{
        'width':document.getElementById('slider_content').offsetWidth +'px'
      },
      'leftArrow':parseFloat(this.state.fase) <= 0 ? false : true,
      'rightArrow':_response[0].sliders.length>1 &&  parseFloat(this.state.fase)<= _response[0].sliders.length -1 ? true : false,
      'arrows': _response[0].sliders[0].fontcolor
    })
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
    switch(this.state.typeItem){
      case 'canal':
        API.action('getChannelOrigen2', {}, this.onSuccessOrigen, this.onError, 'GET', false, true , { 'param' : this.state.focusItem });
      break;
      case 'podcast':
        API.action('getPodcastOrigen', { 'id' : this.state.focusItem }, this.onSuccessOrigen, this.onError, 'GET', false, true);
      break;
      case 'episode':
        API.action('getEpisodeOrigen', { 'id' : this.state.focusItem }, this.onSuccessOrigen, this.onError, 'GET', false, true)
      break;
      default:
      break;
    }
  }
  onSuccessOrigen = (_response) => {
    _response.status === 'success' || this.state.typeItem === 'canal'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setOrigen(_response){
    
    switch(this.state.typeItem){
        case 'canal':
          localStorage.setItem('lastChannel',_response.id);
          localStorage.setItem('lastChannelLink','/podcast/'+_response.id+'/'+_response.name);
          localStorage.setItem('lastChannelName',_response.name);
          localStorage.setItem('lastChannelData',JSON.stringify(_response));
          localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response));
          localStorage.setItem('phase_opinion_'+_response.id, 0);
          window.location.href = './#/podcast/'+_response.id+'/'+_response.name;
        break;
        case 'podcast':
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
        break;
        case 'episode':
          localStorage.setItem('lastItemDatastatic',JSON.stringify(_response.data.episode));
          localStorage.setItem('lastPosition',_response.position % _response.perPhase);//indicates the position
          localStorage.setItem('phase_episode_'+_response.data.episode.id, Math.trunc(_response.position / _response.perPhase));
          localStorage.setItem('lastpodcast',_response.data.podcast.id);
          localStorage.setItem('podcast',JSON.stringify(_response.data.podcast));
          localStorage.setItem('lastpodcastName',_response.data.podcast.name);
          localStorage.setItem('lastItemDataepisode',JSON.stringify(_response.data.podcast));
          localStorage.setItem('lastpodcastLink','/episode/'+_response.data.podcast.id+'/'+_response.data.podcast.name);
          localStorage.setItem('lastChannel',_response.data.channel.id);
          localStorage.setItem('lastChannelData',JSON.stringify(_response.data.channel));
          localStorage.setItem('lastChannelLink','/podcast/'+_response.data.channel.id+'/'+_response.data.channel.name);
          localStorage.setItem('lastChannelName',_response.data.channel.name);
          localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response.data.channel));
          localStorage.setItem('phase_opinion_'+_response.data.podcast.id, 0);
          this.props.initplayer.data = _response.data.episode;
          this.props.initplayer.play(_response.data.episode.file, _response.data.episode.id, _response.data.episode.name, _response.data.episode);
          window.location.href = './#/static/'+_response.data.episode.id+'/'+_response.data.episode.name
        break;
        default:
        break;
    }
  }
  initPlayer(id, type){
    event.stopPropagation();
    Utils.scrollToTop(300);
    /*this.props.auth.isAuthenticated
    ? this.getOrigen()
    : (
      localStorage.setItem('notLoggedType', type),
      localStorage.setItem('notLoggedId', id),
      this.props.auth.required()
    )*/
    this.setState({
      'focusItem':id,
      'typeItem':type
    })
    this.getOrigen()
  }
  handleResize() {
    document.querySelector('.slider').style.width=document.querySelector('.header_web_main').offsetWidth + 'px';
    document.getElementById('slider_content_container').style.width = document.getElementById('slider_content').offsetWidth * this.state.data.collection.length + 'px';     
    this.setState({
      'itemStyle':{
        'width':document.getElementById('slider_content').offsetWidth +'px'
      }
    });
    document.getElementById('slider_content_container').style.left = - this.state.fase * document.getElementById('slider_content').offsetWidth + 'px';
  }
  arrowLeft(){
    this.rightFunction();
  }
  arrowRight(){
    this.leftFunction();
  }
  clickBallHandler(event){
    var fase = parseFloat(event.target.id.replace('ball_item_',''));
    this.setState({
      'fase': fase,
      'itemStyle':{
        'width':document.getElementById('slider_content').offsetWidth +'px'
      },
      'leftArrow': parseFloat(fase) &&  this.state.data.collection.length > 1 ? true : false,
      'rightArrow':this.state.data.collection.length > 1 && parseFloat(fase) < this.state.data.collection.length-1 ? true : false ,
      'arrows':this.state.data.collection[fase].fontcolor
    })
    localStorage.setItem('lastSliderPos',parseFloat(this.state.fase));
    document.getElementById('slider_content_container').style.left = - this.state.fase * document.getElementById('slider_content').offsetWidth + 'px'
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  leftFunction(){
    if((parseFloat(this.state.fase) + 1) >= this.state.data.collection.length-1 ){
       this.setState({
          'fase':this.state.data.collection.length-1,
          'leftArrow':this.state.data.collection.length>1 ? true : false,
          'rightArrow':false,
          'arrows':this.state.data.collection[this.state.data.collection.length-1].fontcolor
        })
    }else{
      this.setState({
          'fase':parseFloat(this.state.fase) + 1,
          'leftArrow':this.state.data.collection.length>1 ? true : false,
          'rightArrow':parseFloat(this.state.fase) + 1 <= this.state.data.collection.length-1,
          'arrows':this.state.data.collection[parseFloat(this.state.fase) + 1].fontcolor
        })
    }
    localStorage.setItem('lastSliderPos',parseFloat(this.state.fase));
    document.getElementById('slider_content_container').style.left = - this.state.fase * document.getElementById('slider_content').offsetWidth + 'px'
  }
  rightFunction(){
    if((parseFloat(this.state.fase) - 1) <= 0 ){
       this.setState({
          'fase':0,
          'leftArrow':false,
          'rightArrow':this.state.data.collection.length>1,
          'arrows':this.state.data.collection[0].fontcolor
        })
    }else{
      this.setState({
          'fase':parseFloat(this.state.fase) - 1,
          'leftArrow':this.state.data.collection.length>1 ? true : false,
          'rightArrow':true,
          'arrows':this.state.data.collection[parseFloat(this.state.fase) - 1].fontcolor
        })
    }
    localStorage.setItem('lastSliderPos',parseFloat(this.state.fase));
    document.getElementById('slider_content_container').style.left = - this.state.fase * document.getElementById('slider_content').offsetWidth + 'px'
  }
  componentDidMount(){
    Utils.swipedetect(document.querySelector('#slider_content'), function(swipedir, toLeft, toRight) {
          switch (swipedir) {
              case "left":
                  if (toLeft != undefined) {
                      toLeft();
                  }
                  break;
              case "right":
                  if (toRight != undefined) {
                      toRight();
                  }
                  break;
              case "up":
                  break;
              case "down":
                  break;
              case "none":
                  break;
          }
      }, this.leftFunction, this.rightFunction
    );
    var logged = localStorage.getItem('logged');
    var param = 0;
    switch(logged){
      case 'true':
        switch(this.props.explorer){
          case 'active':
            param = 4;
          break;
          default:
            param = 3;
          break;
        }
      break;
      default:
        switch(this.props.explorer){
          case 'active':
            param = 4;
          break;
          default:
            param = 2;
          break;
        }
      break;
    }
    localStorage.getItem('notLoggedId')
      ? (
        localStorage.removeItem('notLoggedType'),
        localStorage.removeItem('notLoggedId'),
        this.getOrigen()
      )
      
      : (
        API.action('carousel', {}, this.onSuccess, this.onError, 'get', false, true, { 'param' : param } ),
        window.addEventListener('resize', this.handleResize),
        document.getElementById('slider_content_container').style.left = - this.state.fase * document.getElementById('slider_content').offsetWidth + 'px'
      )
  }
  render() {
    var lan = localStorage.getItem('language');
    var cms = JSON.parse(localStorage.getItem('config')).cms;
    if(typeof this.state.data.collection !== 'undefined'){
      //real
      var collection = this.state.data.collection;
      //real
      document.querySelector('.slider').style.width=document.querySelector('.header_web_main').offsetWidth + 'px';
      document.getElementById('slider_content_container').style.width = document.getElementById('slider_content').offsetWidth * this.state.data.collection.length + 'px';     
    }else{
      collection = [];
    }
    return (
      <div className='slider' >
                <div id='slider_content'>
                  <div id='slider_content_container'>
                    {collection.map(p => {
                      p.buttons = [
                        {
                          'text': p.first_btn_title,
                          'route': p.first_btn_url,
                          'id':p.first_btn_item_id,
                          'type':p.first_btn_type_id
                        },
                        {
                          'text': p.second_btn_title,
                          'route': p.second_btn_url,
                          'id':p.second_btn_item_id,
                          'type':p.second_btn_type_id
                        }
                      ]

                      return (
                        <div className='slider-item' style={this.state.itemStyle} >
                          <div style={'background:'+p.color+';background-image:url("' + cms + ( p.image !== '' ? p.image : '' ) + '")'} >
                                <div className = { p.image_extra !== '' ? 'slider-item-img-sing' :  'hide' }  style={'background-image:url("' + cms + ( p.image_extra !== '' ? p.image_extra : '' ) + '")'}></div>
                                <div className = { p.image_extra !== '' ? 'slider-item-title slider-item-title-img-extra' : 'slider-item-title' } style={'color:'+p.fontcolor+' !important;'} >{p.title}</div>
                                <div className = { p.image_extra !== '' ? 'slider-item-subtitle slider-item-subtitle-img-extra' : 'slider-item-subtitle' }  style={'color:'+p.fontcolor+' !important;'} >{p.subtitle}</div>
                                <div className = 'slider-items-PB' >
                                  { p.buttons.map( q => { 
                                    return (
                                      <div className="slider-item-PB-container" >
                                        {
                                           typeof q.route !== 'undefined' && ( q.route.indexOf('http://') >= 0 || q.route.indexOf('https://') >= 0 )
                                           ?  <a href={q.route} target='_blank' className='slider-item-PB-container'><div className='slider-item-PB' style={'border-color:'+p.fontcolor+' !important'}>
                                                <span style={'color:'+p.fontcolor+' !important;'}>{q.text}</span>
                                              </div></a>
                                           : typeof q.route !== 'undefined' && q.route && q.route.length > 0
                                              ? <div className='slider-item-PB-container'>
                                                  <Link to={q.route} >
                                                    <div className='slider-item-PB' style={'border-color:'+p.fontcolor+' !important'}>
                                                      <span style={'color:'+p.fontcolor+' !important;'}>{q.text}</span>
                                                    </div>
                                                  </Link>
                                                </div>
                                              : ( typeof q.route === 'undefined' || !q.route || q.route.length <= 0 ) && q.id
                                                ? <div className='slider-item-PB-container' onClick={(id, type) => this.initPlayer(q.id, q.type)} >
                                                        <div className='slider-item-PB' style={'border-color:'+p.fontcolor+' !important'}>
                                                          { q.type !== 'canal' 
                                                              ? <div className='item_action_play' style={'border: 3px solid ' + p.fontcolor + '; color:'+p.fontcolor+';border-color:'+p.fontcolor+' !important'} >
                                                                  <div style={'border-left: 7px solid '+p.fontcolor+' !important'} ></div>
                                                                </div>/*<span class="icon-play-circle" style={'color:'+p.fontcolor+';border-color:'+p.fontcolor+' !important'} ></span>*/ 
                                                              : '' 
                                                          }
                                                          <span style={'color:'+p.fontcolor+' !important;'}>{q.text}</span>
                                                        </div>
                                                  </div>
                                                : ''
                                        }
                                      </div>
                                    )
                                  })}
                                </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="slider_content_arrow_left_outer" >
                    <div className="slider_content_arrow_left_inner" >
                      <div className={this.state.leftArrow ? 'slider-arrow-left' : 'hide'}  style={'color:'+this.state.arrows+' !important;'} onClick={this.arrowLeft}>❮</div>
                    </div>
                  </div>
                  <div className="slider_content_arrow_right_outer" >
                    <div className="slider_content_arrow_right_inner" >
                      <div className={this.state.rightArrow ? 'slider-arrow-right' : 'hide'} style={'color:'+this.state.arrows+' !important;'} onClick={this.arrowRight}>❯</div>
                    </div>
                  </div>
                </div>
                <div className='balls'>
                  {collection.map((p , index) => {
                    return (
                      <div className='ball-item'  >
                        <div id={'ball_item_'+index} className={ index == this.state.fase ? 'hidden':'bullEnabled'} onClick={this.clickBallHandler} >&bull;</div>
                        <div className={ index != this.state.fase ? 'hidden':'bullDisabled'}   >&bull;</div>
                      </div>
                    )
                  })}
                </div>
                <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
                <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );
  }
}

Slider.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Slider);
export default Slider;