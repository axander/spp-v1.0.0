import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Modal, API } from '../../../services/Rest.js'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import screenfull from 'screenfull'
import Utils from '../../../utils/Utils.js';
import './PlayerApp.scss'

/*import './reset.scss'
import './defaults.scss'
import './App.scss'
import './Range.scss'*/


import ReactPlayer from '../ReactPlayer'
import Duration from './Duration'

const MULTIPLE_SOURCES = [
  { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', type: 'video/mp4' },
  { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv', type: 'video/ogv' },
  { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm', type: 'video/webm' }
]
const itemToPlay = {
  data:{}
}
class PlayerApp extends Component {
  constructor(props) {
    super(props);
    console.log('props player');
    console.log(props);
    this.state ={
      'url':'',
      'init':false,
      'initF5':false,
      'touchPlayed':0,
      'volume':.8,
      'buffering':true
    }
    this.loadepisode = this.loadepisode.bind(this);
    this.playPause = this.playPause.bind(this);
    this.waitToPlay = this.waitToPlay.bind(this);
    this.getFileSuccess = this.getFileSuccess.bind(this);
    this.getFileError = this.getFileError.bind(this);
    this.getFile = this.getFile.bind(this);
    this.reset = this.reset.bind(this);
    this.f5Prev = this.f5Prev.bind(this);
    this.f5Next = this.f5Next.bind(this);
    this.onSeekUp10 = this.onSeekUp10.bind(this);
    this.onSeekDown10 = this.onSeekDown10.bind(this);
    this.hidePlayer = this.hidePlayer.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.mobilePlay = this.mobilePlay.bind(this);

    this.onSeekMouseDownVolume = this.onSeekMouseDownVolume.bind(this);
    this.onSeekMouseUpVolume = this.onSeekMouseUpVolume.bind(this);
    this.onSeekChangeVolume = this.onSeekChangeVolume.bind(this);
    this.setVolumeProgress = this.setVolumeProgress.bind(this);
    this.handleTouchStartVolume = this.handleTouchStartVolume.bind(this);
    this.handleTouchEndVolume = this.handleTouchEndVolume.bind(this);
  }
  waitToPlay(){
    var dataFile = this.props.deacoplatePlayer.data();

    API.action('saveToList', { 'id_item' : dataFile.id || itemToPlay.data._id , 'type_item':'episode', 'list':'listened', 'value':true }, null, null, 'GET', false, true)
    this.load(JSON.parse(localStorage.getItem('config')).cms+itemToPlay.data.source);
    this.player.seekTo(0);
    this.props.initplayer.init = true;
    typeof this.props.initplayer !== 'undefined' 
    ? (
        /*this.props.showplayer(),*/
        this.setState({ 
          init:true,
          title : itemToPlay.data._name,
          urlPath : JSON.parse(localStorage.getItem('config')).cms+itemToPlay.data.source,
          url: JSON.parse(localStorage.getItem('config')).cms+itemToPlay.data.source,
          playing: this.props.auth.isAuthenticated ? true : false,
          played: 0,
          loaded: 0,
          duration: 0,
          playbackRate: 1.0,
          touchPlayed:0,
          buffering:true
        })
      )
    : this.setState({ 
      init:true,
      title : itemToPlay.data._name,
      urlPath : JSON.parse(localStorage.getItem('config')).cms+itemToPlay.data.source,
      url: JSON.parse(localStorage.getItem('config')).cms+itemToPlay.data.source,
      playing: this.props.auth.isAuthenticated ? true : false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      touchPlayed:0,
      buffering:true
    })
    this.props.auth.isAuthenticated
    ? 'ontouchstart' in document.documentElement
      ? this.mobilePlay()
      : this.props.deacoplatePlayer.tooglePlay(true)/*this.props.delegate.tooglePlay(true)*/
    : null
  }
  mobilePlay(){
    this.playPause();
    this.playPause();
    this.playPause();
    this.props.deacoplatePlayer.tooglePlay('buffering');
  }
  getFileSuccess = (_response) => {
    _response.status === 'success'
    ? (
        itemToPlay.data.source = _response.result,
        this.waitToPlay()
      )
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  getFileError = (_response, _error) =>{
    this.setState({
          isOpen: true,
          showedMsg: _error
      });
  }
  toggleModal = () => {
    this.state.isOpen
    ? localStorage.removeItem('goPremium')
    : null;
    this.setState({
        isOpen: !this.state.isOpen
    });
  }
  getFile(){
    /*this.reset();*/
    document.querySelector('#playerDeacoplate').className = '';
    var dataFile = this.props.deacoplatePlayer.data();
    ( this.props.auth.typeUser !== 'premium' && !JSON.parse(localStorage.getItem('lastItemDatapodcast')).premium  ) || this.props.auth.typeUser === 'premium' 
    ? (
      window.setSpinner(),

      API.action('getFile', { 'id' : dataFile.id || itemToPlay.data._id }, this.getFileSuccess, this.getFileError, 'GET', false, true)
    )
    : (
        /*this.props.delegate.tooglePlay(false),*/
        this.props.deacoplatePlayer.tooglePlay(false),
        localStorage.setItem('goPremium',true),
        this.setState({
            isOpen: true,
            showedMsg: 'user.premium.content'
        })
      )
  }
  loadepisode(_source, _id, _name, _object, autoPlay){
    localStorage.setItem('lastepisode', _id);
    localStorage.setItem('lastepisodeName', _name);
    localStorage.setItem('episodeInfo', JSON.stringify(_object));
    localStorage.setItem('lastOpinion',_id);//,
    itemToPlay.data = {
      'source': _source,
      '_id': _id,
      '_name': _name,
      '_object': _object
    }
    this.setState({
      'init':false
    })
    autoPlay && this.props.auth.isAuthenticated
    ? this.getFile()
    : null;
  }

  state = {
    url: null,
    playing: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  }
  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  }
  playPause = () => {
    
    if(!this.props.initplayer.init){
      this.props.auth.isAuthenticated
        ? (
          this.getFile(),
          document.querySelector('#playerDeacoplate').className = ''
        )
        : (
          localStorage.setItem('savingList',true),
          localStorage.getItem('app')
          ? null
          : this.props.auth.required(this.getFile)
        )
    }else{
      this.setState({ playing: !this.state.playing });
      this.props.deacoplatePlayer.tooglePlay(this.state.playing);
      /*this.props.delegate.tooglePlay(this.state.playing);*/
    }
  }
  tooglePlay = () => {
    return this.state.playing
  }
  toggleLoop = () => {
    this.setState({ loop: !this.state.loop })
  }
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  toggleMuted = () => {
    this.setState({
      volume : this.state.muted ? .8 : 0,
      muted : !this.state.muted
    })
    if (this.state.touch) {
      var audioFile = document.querySelector('#audioFile');
      audioFile
      ? audioFile.muted = this.state.muted
      : null;
    }
  }
  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }
  onPlay = () => {
    console.log('onPlay')
    this.setState({ playing: true })
  }
  onPause = () => {
    console.log('onPause')
    this.setState({ playing: false })
  }
  onSeekInit= e => {
    this.setState({ seeking: false })
    this.player.seekTo(0)
  }
  onSeekUp10= e => {
    this.setState({ seeking: false });
    console.log('los que ha played' + this.state.playedSeconds);
    var played = this.state.playedSeconds + 10;
    played > this.state.duration
    ? played = this.state.duration
    : null;
    this.player.seekTo(played)
  }
  onSeekDown10= e => {
    this.setState({ seeking: false });
    var played = this.state.playedSeconds - 10;
    played < 0
    ? played = 0
    : null;
    this.player.seekTo(played);
  }
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  onProgress = state => {
    console.log('onProgress', state);
    typeof this.props.delegate !== 'undefined' ? this.props.delegate.onProgress(state) : null;
    this.state.buffering = state.buffering;
    state.buffering
    ? this.props.deacoplatePlayer.tooglePlay('buffering')
    : this.props.deacoplatePlayer.tooglePlay(this.state.playing)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  setVolumeProgress(_event){
    _event.preventDefault();
    var prop = (_event.clientX-_event.target.offsetLeft-_event.target.parentNode.offsetLeft)/_event.target.offsetWidth;
    console.log(prop);
    if(prop>1){
      prop = 1;
    }else if(prop<0){
      prop = 0;
    }
    this.setState({
      volume : prop,
      muted : prop ? false : true
    })
  }
  onSeekMouseDownVolume = e => {
    this.setState({
      'volumeDown':true
    })
    this.setVolumeProgress(e);
  }
  onSeekChangeVolume = e => {
    this.state.volumeDown
    ? this.setVolumeProgress(e)
    : null;
  }
  onSeekMouseUpVolume = e => {
    this.setState({
      'volumeDown':false
    })
    this.setVolumeProgress(e);
  }
  handleTouchStartVolume(event){
    event.preventDefault();
    console.log(event.target.parentNode.offsetLeft);
    console.log(event.target.offsetWidth);
    var prop = (event.changedTouches[0].pageX-(event.target.parentNode.offsetLeft-event.target.offsetWidth))/event.target.offsetWidth;
    if(prop>1){
      prop = 1;
    }else if(prop<0){
      prop = 0;
    }
    this.setState({
      volume : prop
    })
  }
  handleTouchEndVolume(event){
    event.preventDefault();
    var prop = (event.changedTouches[0].pageX-(event.target.parentNode.offsetLeft-event.target.offsetWidth))/event.target.offsetWidth;
    console.log(prop);
    if(prop>1){
      prop = 1;
    }else if(prop<0){
      prop = 0;
    }
    this.setState({
      volume : prop
    })
    console.log(prop);
  }
  onEnded = () => {
    console.log('onEnded')
    this.setState({ playing: this.state.loop })
  }
  onDuration = (duration) => {
    console.log('onDuration', duration);
    this.setState({ duration })
  }
  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player))
  }
  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }
  ref = player => {
    this.player = player
  }
  onReady(){
    /*typeof this.props.delegate !== 'undefined' ? this.props.delegate.ready() : null;*/
    typeof this.props.deacoplatePlayer !== 'undefined' ? this.props.deacoplatePlayer.ready() : null;
  }
  onBuffer(){
    alert('buffer');
  }
  reset(){
    this.props.initplayer.init = false;
    this.props.deacoplatePlayer.tooglePlay(false);
    /*this.props.delegate.tooglePlay(false);*/
    this.setState({
      'played':0,
      'duration':0,
      'urlPath':'',
      'playing':false
    })
  }
  /*<td>
      <button onClick={this.stop}>Stop</button>
      <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
      <button onClick={this.onClickFullscreen}>Fullscreen</button>
      <button onClick={this.setPlaybackRate} value={1}>1</button>
      <button onClick={this.setPlaybackRate} value={1.5}>1.5</button>
      <button onClick={this.setPlaybackRate} value={2}>2</button>
    </td>
  */
   onSuccess = (_response) => {
    var phase, position, previous, episodes, _episode ;
    _response.status === 'success'
    ? ( 
      phase = parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0,
      position = !this.state.dir  ? parseFloat(localStorage.getItem('lastPosition')) : this.state.dir === 'next' ? 0 : _response.result.length-1,
      localStorage.setItem('lastPosition',position),
      episodes = _response.result,
      _episode = episodes[position],
      localStorage.setItem('lastPosition',position),
      phase >= (Math.ceil(parseFloat(localStorage.getItem('total'))/parseFloat(localStorage.getItem('perPhase')))-1) && position >= _response.result-length-1
      ? localStorage.setItem('nextDis',false)
      : localStorage.setItem('nextDis',true),
      !position && !parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast')))
      ? localStorage.setItem('prevDis',false)
      : localStorage.setItem('prevDis',true),
      localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode)),
      this.props.initplayer.episodePageList = _response.result,
      this.props.initplayer.reset(),
      this.props.initplayer.data = _episode,
      this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode)
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
  hidePlayer(){
    document.querySelector('#playerDeacoplate').className = 'hide';
    this.reset()
  }
  setPhase(_phase, _fromPages){
    window.setSpinner();//,
    API.action('getEpisode', { 'id' : localStorage.getItem('lastepisode'), 'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
  }
  f5Next(){
    var phase = parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0;
    if(parseFloat(localStorage.getItem('lastPosition'))+1 >= parseFloat(localStorage.getItem('perPhase'))){
      localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),phase +1);
      this.state.dir = 'next';
      this.setPhase(phase +1);
    }else{
      var nextPosition = parseFloat(localStorage.getItem('lastPosition'))+1;
      var episodes = this.props.initplayer.episodePageList; /*var episodes = JSON.parse(localStorage.getItem('episodePageList'));*/
      var _episode = episodes[nextPosition];
      localStorage.setItem('lastPosition',nextPosition);
      phase >= (Math.ceil(parseFloat(localStorage.getItem('total'))/parseFloat(localStorage.getItem('perPhase')))-1) && nextPosition >= episodes.length-1
      ? localStorage.setItem('nextDis',false)
      : localStorage.setItem('nextDis',true);
      !nextPosition
      ? localStorage.setItem('prevDis',false)
      : localStorage.setItem('prevDis',true);
      /*nextPosition === episodes.length-1
      ? localStorage.setItem('nextDis',false)
      : localStorage.setItem('nextDis',true);
      !nextPosition
      ? localStorage.setItem('prevDis',false)
      : localStorage.setItem('prevDis',true);*/
      localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode));
      console.log(this.props);
      this.props.initplayer.reset();
      this.props.initplayer.data = _episode;
      this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode, true);
    }
  }
  f5Prev(){
    var phase = parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0;
    if(!parseFloat(localStorage.getItem('lastPosition'))){
        localStorage.setItem('phase_episode_'+localStorage.getItem('lastpodcast'),phase -1);
        this.state.dir = 'prev';
        this.setPhase(phase -1);
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
  }
  handleTouchStart(event){
    event.preventDefault();
    this.player.isReady = false;
    var prop = (event.changedTouches[0].pageX-event.target.parentNode.offsetLeft)/event.target.offsetWidth;
    if(prop>1){
      prop = 1;
    }else if(prop<0){
      prop = 0;
    }
    this.setState({
      'seeking': true,
      'played':prop
    })
  }
  handleTouchEnd(event){
    event.preventDefault();
    var prop = (event.changedTouches[0].pageX-event.target.parentNode.offsetLeft)/event.target.offsetWidth;
    if(prop>1){
      prop = 1;
    }else if(prop<0){
      prop = 0;
    }
    this.setState({ 
      seeking: false,

      'playedSeconds':this.state.duration*prop
    })
  
    this.player.seekTo(this.state.duration*prop);
  }
  componentDidMount(){

    if ('ontouchstart' in document.documentElement) {
      this.setState({
        'touch':true
      })
    }else{
      this.setState({
        'touch':false
      })
    }

    typeof this.props.deacoplatePlayer !== 'undefined' 
    ?  this.props.deacoplatePlayer.play = this.playPause
    : null;
    typeof this.props.delegate !== 'undefined' 
    ?  this.props.delegate.loading = this.onReady
    : null;
    typeof this.props.delegate !== 'undefined' 
    ?  this.props.delegate.duration = this.onDuration
    : null;
    typeof this.props.initplayer !== 'undefined' 
    ? (
      this.props.initplayer.play= this.loadepisode,
      this.props.initplayer.reset = this.reset
    ) 
    : this.props.fromStatic 
      ? this.loadepisode(this.props.data.file,this.props.data.id,this.props.data.name,this.props.data) 
      : null;
   
    if(typeof this.props.deacoplatePlayer !== 'undefined' && !this.props.deacoplatePlayer.initPlayer && localStorage.getItem('lastepisode')){
      this.setPhase();
      this.props.deacoplatePlayer.initPlayer = true;
      this.props.deacoplatePlayer.data = function(){
        var episode = JSON.parse(localStorage.getItem('lastItemDatastatic'));
        return episode
      }
      this.props.initplayer.reset();
      var _episode = JSON.parse(localStorage.getItem('lastItemDatastatic'));
      this.props.initplayer.data = _episode;
      //this.props.initplayer.play(_episode.file, _episode.id, _episode.name, _episode);
      this.props.initplayer.play('undefined', _episode.id, _episode.name, _episode);
      this.props.deacoplatePlayer.next = this.f5Next;
      this.props.deacoplatePlayer.previous = this.f5Prev;
    }
  }
  
  render () {
    const { url, playing, volume, muted, loop, played, loaded, duration, playbackRate } = this.state
    const SEPARATOR = ' · '

    return (
      <div className='app'>
        <section className='section'>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={this.ref}
              className='react-player'
              width='100%'
              height='100%'
              url={this.state.url}
              playing={playing}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => this.onReady() }
              onStart={() => console.log('onStart')}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onBuffer={() => this.onBuffer}
              onSeek={e => console.log('onSeek', e)}
              onEnded={this.onEnded}
              onError={e => console.log('onError', e)}
              onProgress={this.onProgress}
              onDuration={this.onDuration}
            />

          </div>

          <div className="player-face-header" >
            <div id="player-face-title" className="player-face-title" >{ localStorage.getItem('lastItemDatastatic') ? JSON.parse(localStorage.getItem('lastItemDatastatic')).name : '...'}</div>
            <div class="del_PB_deco" onClick={this.hidePlayer} ><div ><span class="icon-x" ></span></div></div>
          </div>
          <div className='player-face' >
            <div className={ this.state.touch ? "player-face-1" : "player-face-1 player-face-1-desktop" } >
                {/*<div className='previous2'  onClick={this.props.firstEpisode}><span class="icon-skip-back"></span></div>*/}
              <div className={localStorage.getItem('prevDis') === 'true'  ? 'previous2' : 'previous2  disabled'} onClick={typeof this.props.deacoplatePlayer !== 'undefined' ? this.props.deacoplatePlayer.previous : null} ><span class="icon-skip-back"></span></div>
              <div className='backward'  onClick={this.onSeekDown10} ><span class="icon-rewind"></span></div>
              <div className='play' onClick={this.playPause}><span class={playing ? (!duration || duration<=0) || this.state.buffering ? "icon-more-horizontal" : "icon-pause-circle" : "icon-play-circle" } ></span></div>
              <div className='forward2' onClick={this.onSeekUp10} ><span class="icon-fast-forward"></span></div>
              <div className={localStorage.getItem('nextDis') === 'true' ? 'next' : 'next disabled'} onClick={typeof this.props.deacoplatePlayer !== 'undefined' ? this.props.deacoplatePlayer.next : null }><span class="icon-skip-back"></span></div>
              <div className='time_played' ><Duration seconds={ duration * played} /></div>
            </div>
            <div className="player-face-2">
              <div className="player-face-url" >{this.state.urlPath}</div>
              <div className={'ontouchstart' in document.documentElement ? 'progression progression_mobile' :  'progression ' } ><progress max={1} value={played} />
                <input className='progression-seek'
                    type='range' min={0} max={1} step='any'
                    value={played}
                    onMouseDown={this.onSeekMouseDown}
                    onChange={this.onSeekChange}
                    onMouseUp={this.onSeekMouseUp}/>
              </div>
              <div id='player-face-progression-mask' className={this.state.touch ? "player-face-progression-mask" : "player-face-progression-mask player-face-progression-mask-noMobile" } onTouchEnd={this.handleTouchEnd} onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchStart} >
                <div className="basicOuter">
                  <div className="basicInner">
                      <div className="player-face-progression-mask-bg" >

                      </div>
                      <div className="player-face-progression-mask-progress" style={'width:'+ played*100 + '%' } >

                      </div>
                      <div className="player-face-progression-mask-cursor" style={'margin-left:'+ played*100 + '%' } >
                        <div className="player-face-progression-mask-cursor-deco" >
                        
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="player-face-1-1" >
              <div className='previous2'  onClick={this.playPause}><span class="icon-skip-back"></span></div>
              <div className='play'  onClick={this.playPause}><span class={playing ? (!duration || duration<=0) ? "icon-more-horizontal" : "icon-pause-circle" : "icon-play-circle" } ></span></div>
              <div className={this.props.previousDis ? 'backward disabled' : 'backward'}   onClick={this.props.previous}><span class="icon-rewind"></span></div>
              <div className={this.props.nextDis ? 'forward2 disabled' : 'forward2'}  onClick={this.props.next}><span class="icon-fast-forward"></span></div>
              <div className='time_played' ><Duration seconds={duration * played} /></div>
            </div>
            <div className="player-face-3">
              <div className='duration'><Duration seconds={duration} /></div>
              <div className='volume'  onClick={this.toggleMuted}><span class={this.state.muted ? "icon-volume-x" : "icon-volume-2" }></span></div>
              <div id='volume-progression-mask' className={this.state.touch ? "volume-progression-mask volume-progression-mask-desktop" : "volume-progression-mask" } 
                  onTouchEnd={this.handleTouchEndVolume} 
                  onTouchStart={this.handleTouchStartVolume} 
                  onTouchMove={this.handleTouchStartVolume} 
                  onMouseDown={this.onSeekMouseDownVolume}
                  onMouseMove={this.onSeekChangeVolume}
                  onMouseUp={this.onSeekMouseUpVolume}
                  >
                <div className="basicOuter">
                  <div className="basicInner">
                      <div className="volume-progression-mask-bg" >

                      </div>
                      <div className="volume-progression-mask-progress" style={'width:'+ this.state.volume*100 + '%' } >

                      </div>
                      <div className="volume-progression-mask-cursor" style={'margin-left:'+ this.state.volume*100 + '%' } >
                        <div className="volume-progression-mask-cursor-deco" >
                        
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <table><tbody>
            <tr>
              <th></th>
              <td>
                
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='muted'>Muted</label>
              </th>
              <td>
                <input id='muted' type='checkbox' checked={muted} onChange={this.toggleMuted} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='loop'>Loop</label>
              </th>
              <td>
                <input id='loop' type='checkbox' checked={loop} onChange={this.toggleLoop} />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={loaded} /></td>
            </tr>
          </tbody></table>
        </section>
        <section className='section'>
          {/*<table><tbody>
            <tr>
              <th>YouTube</th>
              <td>
                {this.renderLoadButton('https://www.youtube.com/watch?v=oUFJJNQGwhk', 'Test A')}
                {this.renderLoadButton('https://www.youtube.com/watch?v=jNgP6d9HraI', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>SoundCloud</th>
              <td>
                {this.renderLoadButton('https://soundcloud.com/miami-nights-1984/accelerated', 'Test A')}
                {this.renderLoadButton('https://soundcloud.com/tycho/tycho-awake', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Facebook</th>
              <td>
                {this.renderLoadButton('https://www.facebook.com/facebook/videos/10153231379946729/', 'Test A')}
                {this.renderLoadButton('https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Vimeo</th>
              <td>
                {this.renderLoadButton('https://vimeo.com/90509568', 'Test A')}
                {this.renderLoadButton('https://vimeo.com/169599296', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Twitch</th>
              <td>
                {this.renderLoadButton('https://www.twitch.tv/videos/106400740', 'Test A')}
                {this.renderLoadButton('https://www.twitch.tv/videos/12783852', 'Test B')}
                {this.renderLoadButton('https://www.twitch.tv/kronovi', 'Test C')}
              </td>
            </tr>
            <tr>
              <th>Streamable</th>
              <td>
                {this.renderLoadButton('https://streamable.com/moo', 'Test A')}
                {this.renderLoadButton('https://streamable.com/ifjh', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Wistia</th>
              <td>
                {this.renderLoadButton('https://home.wistia.com/medias/e4a27b971d', 'Test A')}
                {this.renderLoadButton('https://home.wistia.com/medias/29b0fbf547', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>DailyMotion</th>
              <td>
                {this.renderLoadButton('https://www.dailymotion.com/video/x5e9eog', 'Test A')}
                {this.renderLoadButton('https://www.dailymotion.com/video/x61xx3z', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Files</th>
              <td>
                {this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', 'mp4')}
                {this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv', 'ogv')}
                {this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm', 'webm')}
                {this.renderLoadButton('http://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', 'mp3')}
                {this.renderLoadButton(MULTIPLE_SOURCES, 'Multiple')}
                {this.renderLoadButton('https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8', 'HLS (m3u8)')}
                {this.renderLoadButton('http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd', 'DASH (mpd)')}
              </td>
            </tr>
            <tr>
              <th>Custom URL</th>
              <td>
                <input ref={input => { this.urlInput = input }} type='text' placeholder='Enter URL' />
                <button onClick={() => this.setState({ url: this.urlInput.value })}>Load</button>
              </td>
            </tr>
          </tbody></table>*/}

          {/*<h2>State</h2>*/}

          <table><tbody>
            <tr>
              <th>url</th>
              <td className={!url ? 'faded' : ''}>
                {(url instanceof Array ? 'Multiple' : url) || 'null'}
              </td>
            </tr>
            <tr>
              <th>playing</th>
              <td>{playing ? 'true' : 'false'}</td>
            </tr>
            <tr>
              <th>volume</th>
              <td>{typeof volume !== 'undefined' && volume ? volume.toFixed(3) : '' }</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{typeof played !== 'undefined' && played ? played.toFixed(3) : ''}</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{typeof loaded !== 'undefined' && loaded ? loaded.toFixed(3) : ''}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td><Duration seconds={duration} /></td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td><Duration seconds={duration * played} /></td>
            </tr>
            <tr>
              <th>remaining</th>
              <td><Duration seconds={duration * (1 - played)} /></td>
            </tr>
          </tbody></table>
        </section>
      <Modal show={this.state.isOpen} onClose={this.toggleModal} >
        {this.translate(this.state.showedMsg)}
      </Modal>
      </div>
    )
  }
}
PlayerApp.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(PlayerApp);
export default PlayerApp;
