import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Opinion from '../../blocks/Opinion/Opinion.js';
import Claim from '../../blocks/Claim/Claim.js'
import New from '../../components/New/New.js'
import IteminfoStatic from '../Iteminfo/IteminfoStatic.js'
import Utils from '../../utils/Utils.js'
import AfterPrevious from '../AfterPrevious/AfterPrevious.js'
import Stats from '../Stats/Stats.js'
import Pages from '../Pages/Pages.js'
import Lists from '../../utils/Lists.js'
import './StaticPlayer.scss'

const _Opinion ={
  refresh(){

  }
}
const _routing = {
  history:[]
}

class StaticPlayer extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    typeof props.location !== 'undefined'
    ? localStorage.setItem('lastState',props.location.pathname)
    : null; 
    this.state = {
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'episode': localStorage.getItem('lastepisode'),
      'options':[],
      'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 ,
      'total':0,
      'refresh':false,
      'position':parseFloat(localStorage.getItem('lastPosition')),
      'dir':null,
      'next':true,
      'previous':false,
      'internal':false,
      'history': localStorage.getItem('routing.history.last') ? parseFloat(localStorage.getItem('routing.history.last'))-1 : -1
    }
    _routing.history = JSON.parse(localStorage.getItem('routing.history')) || [];
    this.setPhase = this.setPhase.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.options =[];
    this.clickHandlerepisodeLater = this.clickHandlerepisodeLater.bind(this);
    this.saveToListLater = this.saveToListLater.bind(this);
    this.onSuccessLater = this.onSuccessLater.bind(this);
    this.clickHandlerepisodeFav = this.clickHandlerepisodeFav.bind(this);
    this.saveToListFav = this.saveToListFav.bind(this);
    this.onSuccessFav = this.onSuccessFav.bind(this);
    this.clickHandlerepisodeShare = this.clickHandlerepisodeShare.bind(this);
    this.setSchemmaFav = this.setSchemmaFav.bind(this);
    this.setSchemmaLater = this.setSchemmaLater.bind(this);
    this.setSchemmaShare = this.setSchemmaShare.bind(this);
    this.clickHandlerOpen = this.clickHandlerOpen.bind(this);
    this.clickHandlerClose = this.clickHandlerClose.bind(this);
    this.handleResize = this.handleResize.bind(this);
    /*this.firstEpisode = this.firstEpisode.bind(this);*/
    this.onSuccessFirst = this.onSuccessFirst.bind(this);
    this.getOrigen = this.getOrigen.bind(this);
    this.getData = this.getData.bind(this);
  }
  onSuccess = (_response) => {
    var phase, position, previous, episodes, _episode ;
    _response.status === 'success'
    ? ( 
      phase = parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0,
      position = !this.state.dir  ? parseFloat(localStorage.getItem('lastPosition')) : this.state.dir === 'next' ? 0 : _response.result.length-1,
      localStorage.setItem('lastPosition',position),
      localStorage.setItem('total',_response.total),
      localStorage.setItem('perPhase',_response.perPhase),
      this.setState ({
        'data':_response.result,
        'total':_response.total,
        'phase': phase || 0 ,
        'perPhase':_response.perPhase,
        'position': position,
        'prevName':_response.prevName,
        'nextName':_response.nextName
      }),
      /*_response.first_episode
      ? localStorage.setItem('firstEpisode', _response.first_episode)
      : null,*/
      !document.querySelector('.iteminfo_static')
      ? (
        episodes = _response.result,
        _episode = episodes[position],
        localStorage.setItem('lastPosition',position),
        this.state.phase >= (Math.ceil(parseFloat(localStorage.getItem('total'))/parseFloat(localStorage.getItem('perPhase')))-1) && position >= parseFloat(localStorage.getItem('perPhase'))-1
        ? localStorage.setItem('nextDis',false)
        : localStorage.setItem('nextDis',true),
        !position && !parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast')))
        ? localStorage.setItem('prevDis',false)
        : localStorage.setItem('prevDis',true),
        localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode)),
        this.props.initplayer.reset(),
        this.props.initplayer.data = _episode,
        this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode)
      )
      : this.initPlayer(this.state.data[position], position),
      localStorage.setItem('episode', JSON.stringify(_response.data))
    )
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  onError = (_response, _error) =>{
    this.setState({
          isOpen: true,
          showedMsg: _error
      });
  }
  toggleModal = () => {
      this.setState({
          isOpen: !this.state.isOpen
      });
   }
  initPlayer(_episode, _position, _fromStatic){
    this.state.internal = false;
    localStorage.setItem('lastPosition',_position),
    localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode));
    Utils.scrollToTop(300);
    //window.location.href = window.location.href+'/'+p.id+'/'+p.name[localStorage.getItem('language')];
    this.props.initplayer.reset();
    this.props.initplayer.data = _episode;
    //this.props.initplayer.play(_episode.file, _episode.id, _episode.name, _episode);
    this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode);
    this.props.initplayer.episodePageList = this.state.data; /*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
    window.location.href = './#/static/'+_episode.id+'/'+_episode.name;
    _fromStatic
    ? _Opinion.refresh(_episode.id)
    :null;
    
    this.setState({
      'refresh':true,
      'position':_position,
      'history':this.state.history+1
    });
    _routing.history[this.state.history]={'position':this.state.position, 'phase':this.state.phase, 'data':_episode, 'hash':document.location.hash};
    localStorage.setItem('routing.history', JSON.stringify(_routing.history));
    localStorage.setItem('routing.history.last',this.state.history);
  }
  initPlayerFromPop(_episode, _position, _fromStatic){
    this.state.internal = false;
    localStorage.setItem('lastPosition',_position),
    localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode));
    Utils.scrollToTop(300);
    //window.location.href = window.location.href+'/'+p.id+'/'+p.name[localStorage.getItem('language')];
    this.props.initplayer.reset();
    this.props.initplayer.data = _episode;
    //this.props.initplayer.play(_episode.file, _episode.id, _episode.name, _episode);
    this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode);
    this.props.initplayer.episodePageList = this.state.data; /*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
    window.location.href = './#/static/'+_episode.id+'/'+_episode.name;
    _fromStatic
    ? _Opinion.refresh(_episode.id)
    :null;
    this.setState({
      'refresh':true,
      'position':_position
    });
    _routing.history[this.state.history]={'position':this.state.position, 'phase':this.state.phase, 'data':_episode, 'hash':document.location.hash};
    localStorage.setItem('routing.history', JSON.stringify(_routing.history));
    localStorage.setItem('routing.history.last',this.state.history);
  }
  /*firstEpisode(){
    this.getFirstEpisode();
  }*/
  getData(){
    var episode = JSON.parse(localStorage.getItem('lastItemDatastatic'));
    return episode
  }
  /*nextDis(){
    if(this.state.phase >= Math.ceil(this.state.total/this.state.perPhase)-1 && !this.state.data[this.state.position+1]){
      return true
    }else{
      return false
    }
  }
  previousDis(){
    if(!this.state.phase && this.state.position === 0){
      return true 
    }else{
      return false
    }
  } */
  
  next(){
    if(!document.querySelector('.iteminfo_static')){
      if(parseFloat(localStorage.getItem('lastPosition'))+1 === this.state.perPhase){
        localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),this.state.phase +1);
        this.state.dir = 'next';
        this.setPhase(this.state.phase +1);
      }else{
        var nextPosition = parseFloat(localStorage.getItem('lastPosition'))+1;
        var episodes = this.props.initplayer.episodePageList; /*var episodes = JSON.parse(localStorage.getItem('episodePageList'))*/
        var _episode = episodes[nextPosition];
        localStorage.setItem('lastPosition',nextPosition);
        this.state.phase >= (Math.ceil(parseFloat(localStorage.getItem('total'))/parseFloat(localStorage.getItem('perPhase')))-1) && nextPosition >= episodes.length-1
        ? localStorage.setItem('nextDis',false)
        : localStorage.setItem('nextDis',true);
        !nextPosition
        ? localStorage.setItem('prevDis',false)
        : localStorage.setItem('prevDis',true);
        localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode));
        this.props.initplayer.reset();
        this.props.initplayer.data = _episode;
        this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode, true);
      }
    }else{
      this.state.internal = false;
      Utils.scrollToTop(300);
      if(!this.state.data[this.state.position+1]){
        localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),this.state.phase +1);
        this.state.dir = 'next';
        this.setPhase(this.state.phase +1);
      }else{
        var _episode = this.state.data[this.state.position+1];
        var state = localStorage.getItem('lastState').split('/')[1];
        localStorage.setItem('lastItemData'+state,JSON.stringify(_episode));
        this.props.initplayer.reset();
        this.props.initplayer.data = _episode;
        this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode, true);
        this.props.initplayer.episodePageList = this.state.data; /*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
        window.location.href = './#/static/'+_episode.id+'/'+_episode.name;
        localStorage.setItem('lastPosition',this.state.position+1);
        _Opinion.refresh(_episode.id);
        localStorage.setItem('routing.history.last',this.state.history);
        this.setState({
          'refresh':true,
          'position':this.state.position+1,
          'dir':'next',
          'history':this.state.history+1
        });
        _routing.history[this.state.history]={'position':this.state.position, 'phase':this.state.phase, 'data':_episode, 'hash':document.location.hash};
        localStorage.setItem('routing.history', JSON.stringify(_routing.history));
      }
    }
  }
  previous(){
    if(!document.querySelector('.iteminfo_static')){
      if(parseFloat(localStorage.getItem('lastPosition'))-1< 0){
        localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),this.state.phase -1);
        this.state.dir = 'prev';
        this.setPhase(this.state.phase -1);
      }else{
        var prevPosition = parseFloat(localStorage.getItem('lastPosition'))-1;
        var episodes = this.props.initplayer.episodePageList; /*var episodes = JSON.parse(localStorage.getItem('episodePageList'));*/
        var _episode = episodes[prevPosition];
        localStorage.setItem('lastPosition',prevPosition),
        !prevPosition && !parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast')))
        ? localStorage.setItem('prevDis',false)
        : localStorage.setItem('prevDis',true);
        prevPosition === episodes.length-1
        ? localStorage.setItem('nextDis',false)
        : localStorage.setItem('nextDis',true);
        localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode));
        this.props.initplayer.reset();
        this.props.initplayer.data = _episode;
        this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode, true);
      }
    }else{
      this.state.internal = false;
      if(this.state.position-1 < 0){
        localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),this.state.phase -1);
        this.state.dir = 'prev';
        this.setPhase(this.state.phase -1);
      }else{
        Utils.scrollToTop(300);
        var _episode = this.state.data[this.state.position-1];
        var state = localStorage.getItem('lastState').split('/')[1];
        localStorage.setItem('lastItemData'+state,JSON.stringify(_episode));
        this.props.initplayer.reset();
        this.props.initplayer.data = _episode;
        this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode, true);
        this.props.initplayer.episodePageList = this.state.data;/*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
        window.location.href = './#/static/'+_episode.id+'/'+_episode.name;
        localStorage.setItem('lastPosition',this.state.position-1);
        _Opinion.refresh(_episode.id);
        localStorage.setItem('routing.history.last',this.state.history);
        this.setState({
          'refresh':true,
          'position':this.state.position-1,
          'dir':'prev',
          'history':this.state.history+1
        });
        _routing.history[this.state.history]={'position':this.state.position, 'phase':this.state.phase, 'data':_episode, 'hash':document.location.hash};
      }
    }
  }
  onSuccessOrigen = (_response) => {
    _response.status === 'success'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  getOrigen(_origen){
    window.setSpinner();
    API.action('getPodcastOrigen', { 'id' : _origen }, this.onSuccessOrigen, this.onError, 'GET', false, true);
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
  /*getFirstEpisode(){
    Utils.scrollToTop(300);
    window.setSpinner();
    API.action('getEpisodeOrigen', { 'id' : localStorage.getItem('firstEpisode') }, this.onSuccessFirst, this.onError, 'GET', false, true)
  }*/
  onSuccessFirst = (_response) => {
    _response.status === 'success'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setSchemmaLater(){
    this.props.initSchemma.setSchemma = Lists.saveToList('episode','later',this.state.episode.id);
    this.props.initSchemma.show('episode','later',this.state.episode);
  }
  clickHandlerepisodeLater(event, _episode){
    event.stopPropagation();
    this.state.episode = _episode;
    this.props.auth.isAuthenticated
    ? this.saveToListLater()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToListLater)
      )
    /*event.stopPropagation();
    this.state.episode = _episode
    this.props.auth.isAuthenticated
    ? this.setSchemmaLater()
    : (
      localStorage.setItem('savingList',true),
      localStorage.getItem('app')
      ? (
          this.props.auth.afterRequiredApp = this.setSchemmaLater,
          window.location.href = './#/login'
        )
      : this.props.auth.required(this.setSchemmaLater)
    )*/
  }
  saveToListLater(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.episode.isLater
    ? API.action('saveToList', { 'id_item' : this.state.episode.id , 'type_item':'episode', 'list':'later', 'value':false }, this.onSuccessLater, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.episode.id , 'type_item':'episode', 'list':'later', 'value':true }, this.onSuccessLater, this.onError, 'GET', false, true)
  }
  onSuccessLater(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    if(lastSearch){
      for( var j in lastSearch['episodes'].result){
        lastSearch['episodes'].result[j].id === this.state.episode.id
        ? lastSearch['episodes'].result[j].isLater = !lastSearch['episodes'].result[j].isLater
        : null
      }
      localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
    }
    var lastItemDatastatic = JSON.parse(localStorage.getItem('lastItemDatastatic'));
    lastItemDatastatic
    ? ( 
      lastItemDatastatic.isLater = !lastItemDatastatic.isLater,
      localStorage.setItem('lastItemDatastatic', JSON.stringify(lastItemDatastatic))
      )
    :null;
    this.state.episode.isLater = !this.state.episode.isLater;
    this.setState({
      'refreshing':false
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
  }
  setSchemmaFav(){
    this.props.initSchemma.setSchemma = Lists.saveToList('episode','fav',this.state.episode.id);
    this.props.initSchemma.show('episode','fav',this.state.episode);
  }
  clickHandlerepisodeFav(event, _episode){
    event.stopPropagation();
    this.state.episode = _episode;
    this.props.auth.isAuthenticated
    ? this.saveToListFav()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToListFav)
      )
    /*event.stopPropagation();
    this.state.episode = _episode
    this.props.auth.isAuthenticated
    ? this.setSchemmaFav()
    : (
      localStorage.setItem('savingList',true),
      localStorage.getItem('app')
      ? (
          this.props.auth.afterRequiredApp = this.setSchemmaFav,
          window.location.href = './#/login'
        )
      : this.props.auth.required(this.setSchemmaFav)
    )*/
  }
  saveToListFav(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.episode.isFavorite
    ? API.action('saveToList', { 'id_item' : this.state.episode.id , 'type_item':'episode', 'list':'fav', 'value':false }, this.onSuccessFav, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.episode.id , 'type_item':'episode', 'list':'fav', 'value':true }, this.onSuccessFav, this.onError, 'GET', false, true)
  }
  onSuccessFav(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    if(lastSearch){
      for( var j in lastSearch['episodes'].result){
        lastSearch['episodes'].result[j].id === this.state.episode.id
        ? lastSearch['episodes'].result[j].isFavorite = !lastSearch['episodes'].result[j].isFavorite
        : null
      }
      localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
    }
    var lastItemDatastatic = JSON.parse(localStorage.getItem('lastItemDatastatic'));
    lastItemDatastatic
    ? ( 
      lastItemDatastatic.isFavorite = !lastItemDatastatic.isFavorite,
      localStorage.setItem('lastItemDatastatic', JSON.stringify(lastItemDatastatic))
      )
    :null;
    this.state.episode.isFavorite = !this.state.episode.isFavorite;
    this.setState({
      'refreshing':false
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
  }
  setSchemmaShare(){
    this.props.initSchemma.setSchemma = Lists.saveToList('episode','share',this.state.episode.id);
    this.props.initSchemma.show('episode','share',this.state.episode);
  }
  clickHandlerepisodeShare(event, _episode){
    event.stopPropagation();
    this.state.episode = _episode
    this.props.auth.isAuthenticated
    ? this.setSchemmaShare()
    : (
      localStorage.setItem('savingList',true),
      localStorage.getItem('app')
      ? (
          this.props.auth.afterRequiredApp = this.setSchemmaShare,
          window.location.href = './#/login'
        )
      : this.props.auth.required(this.setSchemmaShare)
    )
  }
  clickHandlerClose(_option){
    this.options[_option]= false;
    this.setState({
      'options':this.options
    })
  }
  clickHandlerOpen(_option){
    this.options[_option]= true;
    this.setState({
      'options':this.options
    })
  }
  setPhase(_phase, _fromPages){
    _fromPages ? this.state.dir = 'next' : null;
    window.setSpinner();//,
    API.action('getEpisode', { 'id' : localStorage.getItem('lastepisode'), 'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
  }
  componentDidMount() {
    //window.googletag.cmd.push(function() { window.googletag.display('right1'); }) 
    window.onpopstate = ()=> {
      if(this.state.internal){
        if(typeof _routing.history[this.state.history-1] !=='undefined' && decodeURI(_routing.history[this.state.history-1].hash) === decodeURI(document.location.hash)){
          this.setState({
            'history':this.state.history-1
          });
          localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),_routing.history[this.state.history].phase);
          this.initPlayerFromPop(_routing.history[this.state.history].data, _routing.history[this.state.history].position, true);
        }else if(typeof _routing.history[this.state.history+1] !=='undefined' && decodeURI(_routing.history[this.state.history+1].hash) === decodeURI(document.location.hash)){
          this.setState({
            'history':this.state.history+1
          });
          localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),_routing.history[this.state.history].phase);
          this.initPlayerFromPop(_routing.history[this.state.history].data, _routing.history[this.state.history].position, true);
        }
      }else{
        this.state.internal = true
      }
    }

    this.props.deacoplatePlayer.next = this.next;
    this.props.deacoplatePlayer.previous = this.previous;
    /*this.props.deacoplatePlayer.nextDis  = this.nextDis;
    this.props.deacoplatePlayer.previousDis  = this.previousDis;*/
    this.props.deacoplatePlayer.data = this.getData;

    window.addEventListener('resize', this.handleResize);
    Utils.scrollToTop(300);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    });
    window.setSpinner();//,
    API.action('getEpisode', { 'id' : this.state.episode, 'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
  }
  componentWillUnmount() {
    window.onpopstate = () => {}
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize() {
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
  }
  render() {
    let lastPodcastPremium = JSON.parse(localStorage.getItem('lastItemDataepisode')).canal.premium;
    let ClaimDiv;
    this.props.auth.typeUser !== 'premium'
    ? ClaimDiv = <div className="col-xs-12 col-sm-4" >
                <div id='right1' >
                  
                </div>
                <Claim />
              </div>
    : ClaimDiv = '';
    let lan = localStorage.getItem('language')
    let episode;
    if(typeof this.props.initplayer.data.id !== 'undefined'){
      episode = this.props.initplayer.data;
      localStorage.setItem('lastepisodePlayed', JSON.stringify(episode));
    }else{
      episode = JSON.parse(localStorage.getItem('lastepisodePlayed'));
    }
    let Iteminfo;
    if(this.state.refresh){
      this.state.refresh = false;
      Iteminfo = <IteminfoStatic 
                  /*firstEpisode = {this.firstEpisode}*/
                  next={this.next} 
                  previous={this.previous} 
                  previousDis = {!this.state.phase && this.state.position === 0 ? true : false} 
                  nextDis = {this.state.phase >= Math.ceil(this.state.total/this.state.perPhase)-1 && !this.state.data[this.state.position+1] ? true : false} 
                  episode={this.props.initplayer.data} 
                  data={this.props.location.data} 
                  destiny={this.props.location.destiny} 
                  auth={this.props.auth}  
                  origen="episode" 
                  dataOrigenLink={localStorage.getItem('lastpodcastLink')}  
                  dataOrigen={localStorage.getItem('lastpodcastName')} 
                  initSchemma={this.props.initSchemma} 
                  initplayer ={this.props.initplayer} 
                  deacoplatePlayer = {this.props.deacoplatePlayer} />
    }else{
      Iteminfo = <IteminfoStatic 
                /*firstEpisode = {this.firstEpisode}*/
                next={this.next} 
                previous={this.previous}
                previousDis = {!this.state.phase && this.state.position === 0 ? true : false} 
                nextDis = {this.state.phase >= Math.ceil(this.state.total/this.state.perPhase)-1 && !this.state.data[this.state.position+1] ? true : false} 
                episode={episode} 
                data={this.props.location.data} 
                destiny={this.props.location.destiny} 
                auth={this.props.auth}  
                origen="episode" 
                dataOrigenLink={localStorage.getItem('lastpodcastLink')}  
                dataOrigen={localStorage.getItem('lastpodcastName')} 
                initSchemma={this.props.initSchemma} 
                initplayer ={this.props.initplayer}
                deacoplatePlayer = {this.props.deacoplatePlayer} />
    }
    let PagesList, Collection, AP, prevName, nextName;
    localStorage.setItem('nextDis',this.state.phase >= Math.ceil(this.state.total/this.state.perPhase)-1 && !this.state.data[this.state.position+1] ? false : true);
    localStorage.setItem('prevDis',!this.state.phase && this.state.position === 0 ? false : true);
    if(this.state.total>0){
      PagesList = <Pages 
                  total={this.state.total} 
                  perPhase={this.state.perPhase}  
                  setPhase= {this.setPhase} 
                  auth={this.props.auth} list="episode" />
    }

    if(typeof this.state.data !== 'undefined'){
      Collection = this.state.data;
      typeof Collection[this.state.position-1] !== 'undefined' ? prevName = Collection[this.state.position-1].name : prevName = this.state.prevName;
      typeof Collection[this.state.position+1] !== 'undefined' ? nextName = Collection[this.state.position+1].name : nextName = this.state.nextName;
      AP = <AfterPrevious 
            prevName = {prevName} 
            nextName = {nextName} 
            previousDis = {!this.state.phase && this.state.position === 0 ? true : false} 
            nextDis = {this.state.phase >= Math.ceil(this.state.total/this.state.perPhase)-1 && !this.state.data[this.state.position+1] ? true : false} 
            next={this.next} 
            previous={this.previous} />
    }else{
      Collection =[];
      AP = '';
    }
    return (
      <div className='staticplayer' style={this.state.style}>
        <div class="row" >
            <div>
              {Iteminfo}
            </div>
        </div>
        {AP}
        <div>
          
          <div class="row" >
            <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-sm-8" : "col-xs-12" } >
              <div className='staticplayer_episodes' >
                {this.translate('content.moreEpisodes')}
              </div>
              <div className={!Collection.length ? '':'hide'} >{this.translate('user.listEmpty')}</div>
              <div class="row item_responsive"  >
                {
                  Collection.map((p, index)  => (
                    <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-md-6 item_responsive" : "col-xs-12 col-md-4 item_responsive" } >
                      <div className ={this.props.auth.typeUser  !=='premium' ? 'item_container' : (index-1)%3===0 ? 'item_container' : index%3===0 ? 'item_container_left' : 'item_container_right'} >
                        <div className={ p.id == localStorage.getItem('lastepisode') ? "contentSelected" : "" } >
                            <div className="row item" >
                              <div className="col-xs-12 ">
                                <div className="item_origen" onClick={() => this.getOrigen(p.origin.id)}>
                                  {p.origin.name}
                                </div>
                              </div>
                              <div className="col-xs-12 ">
                                <div className="rot" onClick={(_episode, _position, _fromStatic) => this.initPlayer(p, index, true)}>
                                  {/*{index+1+this.state.phase*this.state.perPhase}. */}{p.name}
                                </div>
                              </div>
                              <div class="desc_cont">
                                <Stats data={p} origen='episode' auth={this.props.auth} />
                                <div class="item_actions">
                                  <div class="item_actions_episode" id={p.id} name={p.name} onClick={(_episode, _position, _fromStatic) => this.initPlayer(p, index, true)} >
                                    <div>
                                      <div class='basicOuter'>
                                        <div class='basicInner'>
                                          <div className="item_desc" style={ 'background-image:url("' + this.state.cms + p.picture + '")'} >
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="item_action_rot" >
                                      <div>
                                        <div class='basicOuter'>
                                          <div class='basicInner'>
                                            <div className='item_action_play'>
                                              <div></div>
                                            </div>
                                            {/*<span class="icon-play-circle"></span>*/}
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <div class='basicOuter'>
                                          <div class='basicInner'>
                                            <div class='item_actions_text' >
                                              {this.translate('listen')}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div class='basicOuter'>
                                      <div class='basicInner'>
                                        <div class="item_actions_options" onClick={() => this.clickHandlerOpen(index)} >
                                          <span class="icon-more-vertical"></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {
                                lastPodcastPremium
                                ? <div className="flag_premium_static" >
                                    <div className="flag_premium_ico" ><span class="icon-award" ></span></div>
                                  </div>
                                : ''
                              }
                              <div className={this.state.options[index] ? 'item_container_to_lists' : 'hide' }  >
                                <div className={ p.isFavorite ? 'item_container_to_lists_item item_container_to_lists_item_true' : 'item_container_to_lists_item' }   id='fav' fav={p.isFavorite} onClick={ (event, _episode) => this.clickHandlerepisodeFav(event, p) } >{p.isFavorite ? this.translate('user.favourite') : this.translate('user.toFavourites')}</div>
                                <div className={ p.isLater ? 'item_container_to_lists_item item_container_to_lists_item_true' : 'item_container_to_lists_item' }   id='later' later={p.isLater} onClick={ (event, _episode) => this.clickHandlerepisodeLater(event, p) } >{p.isLater ? this.translate('user.savedlater') : this.translate('user.toLater')}</div>
                                {/*<div className='item_container_to_lists_item' id='share' onClick={ (event, _episode) => this.clickHandlerepisodeShare(event, p) }>{this.translate('user.toSubscribe')}</div>*/}
                                <div className='item_container_to_lists_item' id='share' alt="share" onClick={ (event, _episode) => this.clickHandlerepisodeShare(event, p) } >{this.translate('user.share')}</div>
                                <div className='item_container_to_lists_close' onClick={() => this.clickHandlerClose(index)} ><span class="icon-x"></span></div>
                              </div>
                            </div>
                        </div>

                      </div>
                      
                    </div>
                  ))
                }
              </div>
              <div class="row" >
                <div className="col-xs-12" >
                  {PagesList}
                </div>
              </div>
            </div>
            {ClaimDiv} 
          </div>
        </div>
        <div class="row" >
          <div className="col-xs-12 opinion_col" >
            <Opinion static="true" origen={this.props.match.params.episode} auth={this.props.auth} update={_Opinion} type="episode" />
          </div>
        </div>
        <div class="row" >
          <div className="col-xs-12 opinion_col" >
            <New origen={localStorage.getItem('lastpodcast')} auth={this.props.auth} initplayer={this.props.initplayer} />
          </div>
        </div>
      </div>
    );
  }
}

StaticPlayer.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(StaticPlayer);
export default StaticPlayer;