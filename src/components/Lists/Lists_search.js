import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API, Modal } from '../../services/Rest.js'
import LocalSpinner from '../../blocks/Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../../blocks/Common/LocalError/LocalError.js'
import Utils from '../../utils/Utils.js'
import './Lists_search.scss'

class Lists_web extends React.Component {
  constructor(props) {
    super(props);
    var typeItem = '';
    switch(this.props.item){
      case 'canals':
      break;
      case 'podcasts':
        typeItem = 'podcast';
      break;
      case 'episodes':
        typeItem = 'episode';
      break;
    }
    this.state={
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'init':true,
      'loading':true,
      'error':false,
      'data':[],
      'type':this.props.type,
      'focus': JSON.parse(localStorage.getItem('searchFocus')),
      'focusItem':0,
      'showOptions': -1,
      'typeItem': typeItem,
      'idItem':-1
    }
    this.cancelOptionsItem = this.cancelOptionsItem.bind(this);
    this.clickHandlerSubscribe = this.clickHandlerSubscribe.bind(this);
    this.onSuccessSubscribe = this.onSuccessSubscribe.bind(this);
    this.clickHandlerLater= this.clickHandlerLater.bind(this);
    this.onSuccessLater = this.onSuccessLater.bind(this);
    this.clickHandlerFav= this.clickHandlerFav.bind(this);
    this.onSuccessFav = this.onSuccessFav.bind(this);
    this.goSearch = this.goSearch.bind(this);
  }
  showOptionsItem(position){
      this.setState({
        'showOptions': position
      })
  }
  cancelOptionsItem(){
      this.setState({
        'showOptions': -1
      })
  }
  clickHandlerSubscribe(event, _item){
    event.stopPropagation();
    this.setState({
      'idItem':_item.id,
      'isSubscribed':_item.isSubscribed
    })
    this.props.auth.isAuthenticated
    ? this.saveToListSubscribe()
    : localStorage.getItem('app')
      ? null
      : this.props.auth.required(this.saveToListSubscribe);
  }
  saveToListSubscribe(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.isSubscribed
    ? API.action('saveToList', { 'id_item' : this.state.idItem , 'type_item':this.state.typeItem, 'list':'subscribe', 'value':false }, this.onSuccessSubscribe, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.idItem , 'type_item':this.state.typeItem, 'list':'subscribe', 'value':true }, this.onSuccessSubscribe, this.onError, 'GET', false, true)
  }
  onSuccessSubscribe(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    for( var j in lastSearch[this.props.item].result){
      lastSearch[this.props.item].result[j].id === this.state.idItem
      ? lastSearch[this.props.item].result[j].isSubscribed = !lastSearch[this.props.item].result[j].isSubscribed
      : null
    }
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
    var lastItemDataepisode = JSON.parse(localStorage.getItem('lastItemDataepisode'));
    lastItemDataepisode && lastItemDataepisode.id === this.state.idItem
    ? ( 
      lastItemDataepisode.isSubscribed = !lastItemDataepisode.isSubscribed,
      localStorage.setItem('lastItemDataepisode', JSON.stringify(lastItemDataepisode))
      )
    :null;
    this.setState({
      'refreshing':false
    })
  }
  clickHandlerLater(event, _item){
    event.stopPropagation();
    this.setState({
      'idItem':_item.id,
      'isLater':_item.isLater
    })
    this.props.auth.isAuthenticated
    ? this.saveToListLater()
    : localStorage.getItem('app')
      ? null
      : this.props.auth.required(this.saveToListLater);
  }
  saveToListLater(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.isLater
    ? API.action('saveToList', { 'id_item' : this.state.idItem , 'type_item':this.state.typeItem, 'list':'later', 'value':false }, this.onSuccessLater, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.idItem , 'type_item':this.state.typeItem, 'list':'later', 'value':true }, this.onSuccessLater, this.onError, 'GET', false, true)
  }
  onSuccessLater(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    for( var j in lastSearch[this.props.item].result){
      lastSearch[this.props.item].result[j].id === this.state.idItem
      ? lastSearch[this.props.item].result[j].isLater = !lastSearch[this.props.item].result[j].isLater
      : null
    }
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
    var lastItemData;
    this.state.typeItem === 'episode'
      ? lastItemData = JSON.parse(localStorage.getItem('lastItemDatastatic'))
      : null
    lastItemData && lastItemData.id === this.state.idItem
      ? (
        lastItemData.isLater = !lastItemData.isLater,
        localStorage.setItem('lastItemDatastatic', JSON.stringify(lastItemData))
        )
      : null;
    var lastepisodePlayed
    this.state.typeItem === 'episode'
      ? lastepisodePlayed = JSON.parse(localStorage.getItem('lastepisodePlayed'))
      : null
    lastepisodePlayed && lastepisodePlayed.id === this.state.idItem
      ? (
        lastepisodePlayed.isLater = !lastepisodePlayed.isLater,
        localStorage.setItem('lastepisodePlayed', JSON.stringify(lastepisodePlayed))
      )
      : null;
    var episodeInfo
    this.state.typeItem === 'episode'
      ? episodeInfo = JSON.parse(localStorage.getItem('episodeInfo'))
      : null
    episodeInfo && episodeInfo.id === this.state.idItem
      ? (
        episodeInfo.isLater = !episodeInfo.isLater,
        localStorage.setItem('episodeInfo', JSON.stringify(episodeInfo))
      )
      : null;
    var episode
    this.state.typeItem === 'episode'
      ? episode = JSON.parse(localStorage.getItem('episode'))
      : null
    episode && episode.id === this.state.idItem
      ? (
        episode.isLater = !episode.isLater,
        localStorage.setItem('episode', JSON.stringify(episode))
      )
      : null;
    var routingHistory
    this.state.typeItem === 'episode'
      ? routingHistory = JSON.parse(localStorage.getItem('routing.history'))
      : null
    if(routingHistory){
      for( var j in routingHistory){
        routingHistory[j].data.id === this.state.idItem
        ? (
            routingHistory[j].data.isLater = !routingHistory[j].data.isLater,
            localStorage.setItem('routing.history', JSON.stringify(routingHistory))
          )
        :null
      }
    }
    var episodePageList
    this.state.typeItem === 'episode'
      ? episodePageList =  this.props.initplayer.episodePageList /*episodePageList = JSON.parse(localStorage.getItem('episodePageList'))*/
      : null
    if(episodePageList){
      for( var j in episodePageList){
        episodePageList[j].id === this.state.idItem
        ? (
            episodePageList[j].isLater = !episodePageList[j].isLater,
            this.props.initplayer.episodePageList = episodePageList
            /*localStorage.setItem('episodePageList', JSON.stringify(episodePageList))*/
          )
        :null
      }
    }
    this.setState({
      'refreshing':false
    })
  }
  clickHandlerFav(event, _item){
    event.stopPropagation();
    this.setState({
      'idItem':_item.id,
      'isFavorite':_item.isFavorite
    })
    this.props.auth.isAuthenticated
    ? this.saveToListFav()
    : localStorage.getItem('app')
      ? null
      : this.props.auth.required(this.saveToListFav);
  }
  saveToListFav(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.isFavorite
    ? API.action('saveToList', { 'id_item' : this.state.idItem , 'type_item':this.state.typeItem, 'list':'fav', 'value':false }, this.onSuccessFav, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.idItem , 'type_item':this.state.typeItem, 'list':'fav', 'value':true }, this.onSuccessFav, this.onError, 'GET', false, true)
  }
  onSuccessFav(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    for( var j in lastSearch[this.props.item].result){
      lastSearch[this.props.item].result[j].id === this.state.idItem
      ? lastSearch[this.props.item].result[j].isFavorite = !lastSearch[this.props.item].result[j].isFavorite
      : null
    }
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
    var lastItemData;
    this.state.typeItem === 'podcast'
      ? lastItemData = JSON.parse(localStorage.getItem('lastItemDataepisode'))
      : lastItemData = JSON.parse(localStorage.getItem('lastItemDatastatic'));
    lastItemData && lastItemData.id === this.state.idItem
      ? (
        lastItemData.isFavorite = !lastItemData.isFavorite,
        this.state.typeItem === 'podcast'
          ? localStorage.setItem('lastItemDataepisode', JSON.stringify(lastItemData))
          : localStorage.setItem('lastItemDatastatic', JSON.stringify(lastItemData))
        )
      : null;
    var lastepisodePlayed
    this.state.typeItem === 'episode'
      ? lastepisodePlayed = JSON.parse(localStorage.getItem('lastepisodePlayed'))
      : null
    lastepisodePlayed && lastepisodePlayed.id === this.state.idItem
      ? (
        lastepisodePlayed.isFavorite = !lastepisodePlayed.isFavorite,
        localStorage.setItem('lastepisodePlayed', JSON.stringify(lastepisodePlayed))
      )
      : null;
    var episodeInfo
    this.state.typeItem === 'episode'
      ? episodeInfo = JSON.parse(localStorage.getItem('episodeInfo'))
      : null
    episodeInfo && episodeInfo.id === this.state.idItem
      ? (
        episodeInfo.isFavorite = !episodeInfo.isFavorite,
        localStorage.setItem('episodeInfo', JSON.stringify(episodeInfo))
      )
      : null;
    var episode
    this.state.typeItem === 'episode'
      ? episode = JSON.parse(localStorage.getItem('episode'))
      : null
    episode && episode.id === this.state.idItem
      ? (
        episode.isFavorite = !episode.isFavorite,
        localStorage.setItem('episode', JSON.stringify(episode))
      )
      : null;
    var routingHistory
    this.state.typeItem === 'episode'
      ? routingHistory = JSON.parse(localStorage.getItem('routing.history'))
      : null
    if(routingHistory){
      for( var j in routingHistory){
        routingHistory[j].data.id === this.state.idItem
        ? (
            routingHistory[j].data.isFavorite = !routingHistory[j].data.isFavorite,
            localStorage.setItem('routing.history', JSON.stringify(routingHistory))
          )
        :null
      }
    }
    var episodePageList
    this.state.typeItem === 'episode'
      ? episodePageList =  this.props.initplayer.episodePageList /*episodePageList = JSON.parse(localStorage.getItem('episodePageList'))*/
      : null
    if(episodePageList){
      for( var j in episodePageList){
        episodePageList[j].id === this.state.idItem
        ? (
            episodePageList[j].isFavorite = !episodePageList[j].isFavorite,
            this.props.initplayer.episodePageList = episodePageList
            /*localStorage.setItem('episodePageList', JSON.stringify(episodePageList))*/
          )
        :null
      }
    }
    
    this.setState({
      'refreshing':false
    })
  }
  onSuccessOrigen = (_response) => {
    _response.status === 'success' || this.state.originType === 'canals'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setOrigen(_response){
    console.log(_response);
    switch(this.state.originType){
      case 'canals':
        _response.perPhase = 10;
        localStorage.setItem('lastPosition',_response[0].position % _response.perPhase);//indicates the position
        localStorage.setItem('phase_podcast_'+_response[0].id, Math.trunc(_response[0].position / _response.perPhase));
        localStorage.setItem('lastChannel',_response[0].id);
        localStorage.setItem('lastChannelLink','/podcast/'+_response[0].id+'/'+_response[0].name);
        localStorage.setItem('lastChannelName',_response[0].name);
        localStorage.setItem('lastChannelData',JSON.stringify(_response[0]));
        localStorage.setItem('lastChannelData',JSON.stringify(_response[0]));
        localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response[0]));
        localStorage.setItem('phase_opinion_'+_response[0].id, 0);
        window.location.href = './#/podcast/'+_response[0].id+'/'+_response[0].name;
      break;
      case 'podcasts':
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
      case 'episodes':
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
        window.location.href = './#/static/'+_response.data.episode.id+'/'+_response.data.episode.name;
      break;
      default:
      break;
    }
  }
  goSearch(_p){
    event.stopPropagation();
    localStorage.setItem('searchFocus', JSON.stringify(_p) );
    localStorage.setItem('searchType', this.props.item );
    localStorage.setItem('searchFocus', JSON.stringify(_p) );
    this.setState({
      'focus' : _p
    })
    this.getOrigen();
    /*this.props.auth.isAuthenticated
    ? this.getOrigen()
    : (
      localStorage.setItem('staticNotLogged', true),
      this.props.item === 'canals'
      ? (
        localStorage.setItem('lastChannelData', JSON.stringify(this.state.focus)),
        localStorage.setItem('lastItemDatastatic', JSON.stringify(this.state.focus))
        )
      : this.props.item === 'podcasts'
        ? localStorage.setItem('lastItemDataepisode', JSON.stringify(this.state.focus))
        : localStorage.setItem('lastItemDatastatic', JSON.stringify(this.state.focus)),
        this.props.auth.required()
    )*/
  }
  
  getOrigen(){
    Utils.scrollToTop(300);
    window.setSpinner();
    this.state.originType = localStorage.getItem('searchType');
    localStorage.removeItem('searchType');
    switch(this.state.originType){
      case 'canals':
        API.action('getChannelOrigen', {}, this.onSuccessOrigen, this.onError, 'GET', false, true , { 'param' : this.state.focus.slug });
      break;
      case 'podcasts':
        API.action('getPodcastOrigen', { 'id' : this.state.focus.id }, this.onSuccessOrigen, this.onError, 'GET', false, true);
      break;
      case 'episodes':
        API.action('getEpisodeOrigen', { 'id' : this.state.focus.id }, this.onSuccessOrigen, this.onError, 'GET', false, true);
      break;
    }
    
  }
  componentDidMount(){
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    localStorage.getItem('staticNotLogged')
      ? (
        localStorage.removeItem('searchFocus'),
        localStorage.removeItem('staticNotLogged'),
        this.getOrigen()
      )
      
      : null;
  }
  componentWillUnmount() {
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
    var Coll = JSON.parse(localStorage.getItem('lastSearch'))[this.props.item].result;
    return (
      <div className='lists_search' >
        <div className='listsWebBlock' >
          <div className={!Coll.length ? '':'hide'} >{this.translate('user.listEmpty')}</div>
          <div>
            {Coll.map(( p , index) => {
              var itemGo
              this.props.item !== 'algún tipo'
              ? itemGo = <div className="listsWebBlock_item_play" onClick={() => this.goSearch(p)} >
                    <div className='listsWebBlock_item_play_PB'>
                      <div className='listsWebBlock_item_play_PB_deco'>
                        <div>&#9658;</div>
                      </div>
                    </div>
                  </div>
              : itemGo = <div className="listsWebBlock_item_play" onClick={() => this.goSearch(p)} >
                    <div className='listsWebBlock_item_play_PB'>
                      Go
                    </div>
                  </div>

              return (
                <div id={'listsWebBlock_item_' + index} className="listsWebBlock_item" >
                  {itemGo}
                  <div className="listsWebBlock_item_image" onClick={() => this.goSearch(p)} ><div className="listsWebBlock_item_image_thumb" style={ this.props.item ==='episodes' ? 'background-image:url("' + this.state.cms + p.picture + '")' : 'background-image:url("' + this.state.cms + p.image + '")'} ></div></div>
                  <div className="listsWebBlock_item_name">
                    <div className="listsWebBlock_item_name_title" onClick={() => this.goSearch(p)} >{this.props.item !== 'episodes' ? index+1 +'.' : ''} {p.name}</div>
                     <div className="listsWebBlock_item_description" >{p.descripction}</div>
                  </div>
                  {
                    this.props.item === 'algún tipo'
                    ? <div className="listsWebBlock_item_options" >
                        <div className="listsWebBlock_item_options_deco" onClick={(position) => this.showOptionsItem(index)} >
                          •••
                        </div>
                      </div>
                    : ''
                  }
                  <div className="listsWebBlock_item_duration" >{this.props.item === 'episodes' ? Utils.hoursMinutesSeconds(p.duration) : ''}</div>
                  <div className={ this.state.showOptions === index ? 'list_ask_delete' : 'hide' } >
                    <div class="basicOuter">
                      <div class="basicInner">
                        <div>
                          { 
                            this.props.item === 'episodes'
                            ? <div className={ p.isLater ? 'item_container_to_lists_item item_container_to_lists_item_true' : 'item_container_to_lists_item' }   id='later' later={p.isLater} onClick={ (event, _item) => this.clickHandlerLater(event, p) } >{p.isLater ? this.translate('user.savedlater') : this.translate('user.toLater')}</div>
                            : ''
                          }
                          { 
                            this.props.item === 'podcasts'
                            ? <div className={ p.isSubscribed ? 'item_container_to_lists_item item_container_to_lists_item_true' : 'item_container_to_lists_item' }  id='share' subscribed={p.isSubscribed} onClick={ (event, _item) => this.clickHandlerSubscribe(event, p) }  >{p.isSubscribed ? this.translate('user.subscribed') : this.translate('user.toSubscribe')}</div>
                            : ''
                          }
                          <div className={ p.isFavorite ? 'item_container_to_lists_item item_container_to_lists_item_true' : 'item_container_to_lists_item' }   id='fav' fav={p.isFavorite} onClick={ (event, _item) => this.clickHandlerFav(event, p) } >{p.isFavorite ? this.translate('user.favourite') : this.translate('user.toFavourites')}</div>
                          <div className="list_ask_delete_cancel" onClick={this.cancelOptionsItem}>{this.translate('cancel')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div>
    );
  }
}

Lists_web.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Lists_web);
export default Lists_web;