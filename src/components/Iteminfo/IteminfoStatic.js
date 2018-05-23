import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
/*import PlayerApp from '../Player/PlayerApp/PlayerApp.js'*/
import Stats from '../Stats/Stats.js'
import Lists from '../../utils/Lists.js'
import { Modal, API } from '../../services/Rest.js'
import './IteminfoStatic.scss'

const delegate = {
  style:'',
  play(){
    
  },
  returnTooglePlay(_playing){

  },
  tooglePlay(_playing){
    this.returnTooglePlay(_playing);
  },
  loading(_status){
  },
  ready(){
  },
  onProgress(_seconds){
    console.log('inter');
    console.log(_seconds);
    this.returnOnProgress(_seconds)
  },
  returnOnProgress(){

  }
}
const bodyScroll = {
  posY:0
}
class IteminfoStatic extends React.Component {
  constructor(props) {
    super(props);
    console.log('iteminfo');
    console.log(this.props);
    this.state={
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'data':this.props.data,
      'actions':this.props.actions,
      'origen': this.props.origen,
      'playing':false,
      'loading':false
    }
    this.clickHandlerLater = this.clickHandlerLater.bind(this);
    this.saveToListLater = this.saveToListLater.bind(this);
    this.onSuccessLater = this.onSuccessLater.bind(this);
    this.clickHandlerFav = this.clickHandlerFav.bind(this);
    this.saveToListFav = this.saveToListFav.bind(this);
    this.onSuccessFav = this.onSuccessFav.bind(this);
    this.clickHandlerChannelShare = this.clickHandlerChannelShare.bind(this); 
    this.setSchemmaFav = this.setSchemmaFav.bind(this);
    this.setSchemmaLater = this.setSchemmaLater.bind(this);
    this.setSchemmaShare = this.setSchemmaShare.bind(this); 
    this.showMenuResponsive= this.showMenuResponsive.bind(this);
    this.hideMenuResponsive= this.hideMenuResponsive.bind(this);
    this.play = this.play.bind(this);
    this.delegateTooglePlay = this.delegateTooglePlay.bind(this);
    this.ready = this.ready.bind(this);
    this.delegateOnProgress = this.delegateOnProgress.bind(this);
    this.delegateDuration = this.delegateDuration.bind(this);

  }
  setSchemmaLater(){
    this.props.initSchemma.setSchemma = Lists.saveToList(this.state.origen,'later',this.state.data.id);
    this.props.initSchemma.show(this.state.origen,'later',this.state.data);
  }
  clickHandlerLater(event, _channel){
    event.stopPropagation();
    this.props.auth.isAuthenticated
    ? this.saveToListLater()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToListLater)
      )
    /*event.stopPropagation();
    this.state.channel = _channel;
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
    this.state.data.isLater
    ? API.action('saveToList', { 'id_item' : this.state.data.id , 'type_item':'episode', 'list':'later', 'value':false }, this.onSuccessLater, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.data.id , 'type_item':'episode', 'list':'later', 'value':true }, this.onSuccessLater, this.onError, 'GET', false, true)
  }
  onSuccessLater(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    if(lastSearch){
      for( var j in lastSearch['episodes'].result){
        lastSearch['episodes'].result[j].id === this.state.data.id
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

    var lastepisodePlayed
    lastepisodePlayed = JSON.parse(localStorage.getItem('lastepisodePlayed'))
    lastepisodePlayed && lastepisodePlayed.id === this.state.data.id
      ? (
        lastepisodePlayed.isLater = !lastepisodePlayed.isLater,
        localStorage.setItem('lastepisodePlayed', JSON.stringify(lastepisodePlayed))
      )
      : null;
    var episodeInfo
    episodeInfo = JSON.parse(localStorage.getItem('episodeInfo'))
    episodeInfo && episodeInfo.id === this.state.data.id
      ? (
        episodeInfo.isLater = !episodeInfo.isLater,
        localStorage.setItem('episodeInfo', JSON.stringify(episodeInfo))
      )
      : null;
    var episode
    episode = JSON.parse(localStorage.getItem('episode'))
    episode && episode.id === this.state.data.id
      ? (
        episode.isLater = !episode.isLater,
        localStorage.setItem('episode', JSON.stringify(episode))
      )
      : null;
    var routingHistory;
    routingHistory = JSON.parse(localStorage.getItem('routing.history'));
    if(routingHistory){
      for( var j in routingHistory){
        routingHistory[j].data.id === this.state.data.id
        ? (
            routingHistory[j].data.isLater = !routingHistory[j].data.isLater,
            localStorage.setItem('routing.history', JSON.stringify(routingHistory))
          )
        :null
      }
    }
    var episodePageList;
    /*episodePageList = JSON.parse(localStorage.getItem('episodePageList'));*/
    episodePageList =  this.props.initplayer.episodePageList;
    if(episodePageList){
      for( var j in episodePageList){
        episodePageList[j].id === this.state.data.id
        ? (
            episodePageList[j].isLater = !episodePageList[j].isLater,
            this.props.initplayer.episodePageList = episodePageList
            /*localStorage.setItem('episodePageList', JSON.stringify(episodePageList))*/
          )
        :null
      }
    }

    this.state.data.isLater = !this.state.data.isLater;
    this.setState({
      'refreshing':false
    })
    this.setState({
      'data': this.state.data
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
  }
  setSchemmaFav(){
    this.props.initSchemma.setSchemma = Lists.saveToList(this.state.origen,'fav',this.state.data.id);
    this.props.initSchemma.show(this.state.origen,'fav',this.state.data);
  }
  clickHandlerFav(event){
    event.stopPropagation();
    this.props.auth.isAuthenticated
    ? this.saveToListFav()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToListFav)
      )
    /*event.stopPropagation();
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
    this.state.data.isFavorite
    ? API.action('saveToList', { 'id_item' : this.state.data.id , 'type_item':this.state.origen, 'list':'fav', 'value':false }, this.onSuccessFav, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.data.id , 'type_item':this.state.origen, 'list':'fav', 'value':true }, this.onSuccessFav, this.onError, 'GET', false, true)
  }
  onSuccessFav(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    if(lastSearch){
      for( var j in lastSearch['episodes'].result){
        lastSearch['episodes'].result[j].id === this.state.data.id
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
    this.state.data.isFavorite = !this.state.data.isFavorite;
    this.setState({
      'data':this.state.data,
      'refreshing':false
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
  }
  setSchemmaShare(){
    this.props.initSchemma.setSchemma = Lists.saveToList(this.state.origen,'share',this.state.data.id);
    this.props.initSchemma.show(this.state.origen,'later',this.state.data);
  }
  clickHandlerChannelShare(event){
    event.stopPropagation();
    this.props.auth.isAuthenticated
    ? this.setSchemmaShare()
    : localStorage.getItem('app')
      ? (
          localStorage.setItem('savingList',true),
          this.props.auth.afterRequiredApp = this.setSchemmaShare,
          window.location.href = './#/login'
        )
      : this.props.auth.required(this.setSchemmaShare)
  }
  play(){
    this.props.auth.isAuthenticated
    ? (
        this.setState({
          'playing' : !this.state.playing
        }),
        this.props.deacoplatePlayer.play()
      )
    : (
      this.props.deacoplatePlayer.play()
    )
  }
  delegateTooglePlay(_playing){
    _playing==='buffering'
    ? this.setState({
        'buffering':true
    })
    : this.props.auth.isAuthenticated
      ? this.setState({
          'playing': _playing,
          'buffering':false
        })
      : null;
  }
  ready(){
    this.setState({
      'loading': false,
      'ready':true
    })
  }
  delegateOnProgress(_state){
    parseFloat(_state.loadedSeconds) > 200
    ? this.setState({
          'loading':false,
          'loadedSeconds':_state.loadedSeconds
        })
    : this.setState({
      'loading':true,
      'loadedSeconds':_state.loadedSeconds
      })
  }
  delegateDuration(_duration){
    this.state.duration = parseFloat(_duration);
  }
  hideMenuResponsive(){
    document.querySelector('.main').style.height='auto';
    window.scrollTo(0,bodyScroll.posY);
    this.setState({
      'menuResponsive':''
    })
  }
  showMenuResponsive(){
    bodyScroll.posY =window.scrollY;
    document.querySelector('.main').style.height=window.innerHeight;
    this.setState({
      'menuResponsive':'menu_responsive_show'
    })
  }
  getTitle(){
    var data = JSON.parse(localStorage.getItem('lastItemDatastatic'));
    return data.name
  }
  componentDidMount() {
    delegate.duration = this.delegateDuration;
    this.props.deacoplatePlayer.tooglePlay = this.delegateTooglePlay;
    this.props.deacoplatePlayer.returnOnProgress = this.delegateOnProgress;
    this.props.deacoplatePlayer.getTitle = this.getTitle;
    this.props.deacoplatePlayer.ready = this.ready;
    /*delegate.ready = this.ready;*/
    /*delegate.returnOnProgress = this.delegateOnProgress;*/
    // Will execute as normal
    var state = localStorage.getItem('lastState').split('/')[1];
    typeof this.state.data === 'undefined'
    ? this.setState({
        'lastState':state,
        'data':JSON.parse(localStorage.getItem('lastItemData'+state)),
        'origen': state === 'podcast' ? 'channel' : state === 'episode' ? 'podcast' : state === 'static' ? 'episode' : null
      })
    : localStorage.setItem('lastItemData'+this.props.destiny, JSON.stringify(this.props.data));
  }
  componentWillUnmount() {
    
  }
  componentWillUpdate(){
    var state = localStorage.getItem('lastState').split('/')[1];
    this.setState({
        'data':JSON.parse(localStorage.getItem('lastItemDatastatic')),
        'ready':false
      })
  }
  
  render() {
    let lan = localStorage.getItem('language');
    return (
      typeof this.state.data !== 'undefined'
      ? (
          <div className='iteminfo_static'>
              <div>
                <div className={'iteminfo_image_container_'+this.props.origen} >
                  <div className ="iteminfo_image" style={"background-image:url('"+ this.state.cms + this.state.data.picture+"')"} >
                    <div class="basicOuter">
                      <div class="basicInner">
                          {/*<span className={this.state.loading ? "iteminfo_play icon-more-horizontal" : this.state.playing ? "iteminfo_play icon-pause-circle" : "iteminfo_play icon-play-circle"} onClick={this.play}></span>*/}
                          <span className={ this.state.playing && ( !this.state.ready || this.state.buffering ) ? "iteminfo_play icon-more-horizontal" : this.state.playing && this.state.ready ? "iteminfo_play icon-pause-circle" : "iteminfo_play icon-play-circle"} onClick={this.play}></span>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div class="iteminfo_container" >
                  <Link to={typeof this.props.dataOrigenLink !== 'undefined' ? this.props.dataOrigenLink : '/channel' }><div className="iteminfo_origen" >
                    {typeof this.props.dataOrigen !== 'undefined' ? this.props.dataOrigen : this.translate('header.explore')}
                  </div></Link>
                  <div className="iteminfo_name" >
                    {this.state.data.name}
                  </div>
                </div>
                {/*<staticPlayer id="staticPlayer" >
                  <PlayerApp 
                    firstEpisode = {this.props.firstEpisode} 
                    next={this.props.next} 
                    previous={this.props.previous} 
                    nextDis={this.props.nextDis} 
                    previousDis={this.props.previousDis} 
                    data={this.props.episode} 
                    fromStatic={true} 
                    delegate={delegate}
                    auth={this.props.auth} 
                    initplayer ={this.props.initplayer} />
                </staticPlayer>*/}
              </div>
              <div>
                <div class="iteminfo_container_desc" >
                  <div class="iteminfo_container_desc_stats">
                    <Stats data={this.state.data} origen="episode" auth={this.props.auth} />
                  </div>
                  <div className='item_info_container_to_lists' >
                    <div className={this.state.data.isFavorite ? 'item_info_container_to_lists_item item_info_container_to_lists_item_true' : 'item_info_container_to_lists_item'}  id='fav' onClick={ (event) => this.clickHandlerFav(event)  }  >{this.state.data.isFavorite ? this.translate('user.favourite') : this.translate('user.toFavourites')}</div>
                    <div className={ this.state.data.isLater ? 'item_info_container_to_lists_item item_info_container_to_lists_item_true' : 'item_info_container_to_lists_item' }   id='later' later={this.state.data.isLater} onClick={ (event, _episode) => this.clickHandlerLater(event, this.state.data) } >{this.state.data.isLater ? this.translate('user.savedlater') : this.translate('user.toLater')}</div>
                    {/*<div className='item_info_container_to_lists_item' id='share' onClick={ (event, _item) => this.clickHandlerChannelShare(event, this.state.data) } >{this.translate('user.toSubscribe')}</div>*/}
                    <div className='item_info_container_to_lists_item' id='share' onClick={ (event, _item) => this.clickHandlerChannelShare(event, this.state.data) } >{this.translate('user.share')}</div>
                    <div className='item_info_container_to_lists_item' id='share'  onClick={this.showMenuResponsive} >
                      <span class="icon-more-horizontal"></span>
                      <span>{this.translate('more')}</span>
                    </div>
                  </div>
                 </div>
                <div class="iteminfo_container_desc mt25 mb25" >
                  <div className="iteminfo_desc">
                    {this.state.data.description}
                  </div>
                </div>
              </div>
              <div className={"menu_responsive " + this.state.menuResponsive} onClick={this.hideMenuResponsive} >
                <div className="menu_responsive_option" >
                  <span class="icon-x"></span>
                </div>
                <div><div className="menu_responsive_option" onClick={ (event, _item) => this.clickHandlerChannelLater(event, this.state.data) } >{this.translate('user.toLater')}</div></div>
                <div><div className="menu_responsive_option" onClick={ (event, _item) => this.clickHandlerChannelShare(event, this.state.data) } >{this.translate('user.share')}</div></div>
              </div>
          </div>
      )
      : ''
    )
  }
}

IteminfoStatic.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(IteminfoStatic);
export default IteminfoStatic;