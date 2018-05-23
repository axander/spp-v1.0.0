import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import IteminfoStatic from '../Iteminfo/IteminfoStatic.js'
import Utils from '../../utils/Utils.js'
import AfterPrevious from '../AfterPrevious/AfterPrevious.js'
import Pages from '../Pages/Pages.js'
import './StaticPlayer.scss'


const _routing = {
  history:[]
}

class StaticPlayerDeacoplate extends React.Component {
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
    this.handleResize = this.handleResize.bind(this);
    this.firstEpisode = this.firstEpisode.bind(this);
    this.onSuccessFirst = this.onSuccessFirst.bind(this);
    this.getOrigen = this.getOrigen.bind(this);
  }
  onSuccess = (_response) => {
    var phase, position, previous;
    _response.status === 'success'
    ? ( 
      phase = parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0,
      position = !this.state.dir  ? parseFloat(localStorage.getItem('lastPosition')) : this.state.dir === 'next' ? 0 : _response.result.length-1,
      localStorage.setItem('lastPosition',position),
      this.setState ({
        'data':_response.result,
        'total':_response.total,
        'phase': phase || 0 ,
        'perPhase':_response.perPhase,
        'position': position,
        'prevName':_response.prevName,
        'nextName':_response.nextName
      }),
      _response.first_episode
      ? localStorage.setItem('firstEpisode', _response.first_episode)
      : null,
      this.initPlayer(this.state.data[position], position),
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
    this.props.initplayer.episodePageList = this.state.data;/*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
    window.location.href = './#/static/'+_episode.id+'/'+_episode.name;

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
    this.props.initplayer.episodePageList = this.state.data;/*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
    window.location.href = './#/static/'+_episode.id+'/'+_episode.name;

    this.setState({
      'refresh':true,
      'position':_position
    });
    _routing.history[this.state.history]={'position':this.state.position, 'phase':this.state.phase, 'data':_episode, 'hash':document.location.hash};
    localStorage.setItem('routing.history', JSON.stringify(_routing.history));
    localStorage.setItem('routing.history.last',this.state.history);
  }
  firstEpisode(){
    this.getFirstEpisode();
  }
  next(){
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
      this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode);
      this.props.initplayer.episodePageList = this.state.data;/*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
      window.location.href = './#/static/'+_episode.id+'/'+_episode.name;
      localStorage.setItem('lastPosition',this.state.position+1);
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
  previous(){
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
      this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode);
      this.props.initplayer.episodePageList = this.state.data;/*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
      window.location.href = './#/static/'+_episode.id+'/'+_episode.name;
      localStorage.setItem('lastPosition',this.state.position-1);
      localStorage.setItem('routing.history.last',this.state.history);
      this.setState({
        'refresh':true,
        'position':this.state.position-1,
        'dir':'prev',
        'history':this.state.history+1
      });
      _routing.history[this.state.history]={'position':this.state.position, 'phase':this.state.phase, 'data':_episode, 'hash':document.location.hash};
      localStorage.setItem('routing.history', JSON.stringify(_routing.history));
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
  getFirstEpisode(){
    Utils.scrollToTop(300);
    window.setSpinner();
    API.action('getEpisodeOrigen', { 'id' : localStorage.getItem('firstEpisode') }, this.onSuccessFirst, this.onError, 'GET', false, true)
  }
  onSuccessFirst = (_response) => {
    _response.status === 'success'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
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
    window.addEventListener('resize', this.handleResize);
    Utils.scrollToTop(300);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    });
    window.setSpinner();//,
    //API.action('getEpisode', { 'id' : this.state.episode, 'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
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
                  firstEpisode = {this.firstEpisode}
                  next={this.next} 
                  previous={this.previous} 
                  previousDis = {!this.state.phase && this.state.position === 0 ? true : false} 
                  nextDis = {this.state.phase >= Math.ceil(this.state.total/this.state.perPhase)-1 && !this.state.data[this.state.position+1] ? true : false} 
                  episode={this.props.initplayer.data} 
                  /*data={this.props.location.data} 
                  destiny={this.props.location.destiny} */
                  auth={this.props.auth}  
                  origen="episode" 
                  dataOrigenLink={localStorage.getItem('lastpodcastLink')}  
                  dataOrigen={localStorage.getItem('lastpodcastName')} 
                  initSchemma={this.props.initSchemma} 
                  initplayer ={this.props.initplayer} 
                  playerDeacoplate = {this.props.playerDeacoplate} />
    }else{
      Iteminfo = <IteminfoStatic 
                firstEpisode = {this.firstEpisode}
                next={this.next} 
                previous={this.previous}
                previousDis = {!this.state.phase && this.state.position === 0 ? true : false} 
                nextDis = {this.state.phase >= Math.ceil(this.state.total/this.state.perPhase)-1 && !this.state.data[this.state.position+1] ? true : false} 
                episode={episode} 
                /*data={this.props.location.data} 
                destiny={this.props.location.destiny} */
                auth={this.props.auth}  
                origen="episode" 
                dataOrigenLink={localStorage.getItem('lastpodcastLink')}  
                dataOrigen={localStorage.getItem('lastpodcastName')} 
                initSchemma={this.props.initSchemma} 
                initplayer ={this.props.initplayer}
                playerDeacoplate = {this.props.playerDeacoplate} />
    }
    let PagesList, Collection, prevName, nextName;
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
    }else{
      Collection =[];
    }
    return (
      <div className='staticplayer' style={this.state.style}>
        <div class="row" >
            <div>
              {Iteminfo}
            </div>
        </div>
      </div>
    );
  }
}

StaticPlayerDeacoplate.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(StaticPlayerDeacoplate);
export default StaticPlayerDeacoplate;