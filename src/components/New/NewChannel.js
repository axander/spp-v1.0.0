import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../../blocks/Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../../blocks/Common/LocalError/LocalError.js'
import Lists from '../../utils/Lists.js'
import share from '../../assets/images/share.png'
import './New.scss'



class NewChannel extends React.Component {
  constructor(props) {
    super(props);
    console.log('new');
    console.log(this.props);
    this.state={
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'init':true,
      'loading':true,
      'error':false,
      'options':[],
      'phase': parseFloat(localStorage.getItem('phase_new_'+localStorage.getItem('lastChannel'))) || 0,
      'total':0,
    }
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

    var routingHistory;
    routingHistory = JSON.parse(localStorage.getItem('routing.history'));
    if(routingHistory){
      for( var j in routingHistory){
        routingHistory[j].data.id === this.state.episode.id
        ? (
            routingHistory[j].data.isLater = !routingHistory[j].data.isLater,
            localStorage.setItem('routing.history', JSON.stringify(routingHistory))
          )
        :null
      }
    }
    var episodePageList;
    episodePageList =  this.props.initplayer.episodePageList; /*episodePageList = JSON.parse(localStorage.getItem('episodePageList'));*/
    if(episodePageList){
      for( var j in episodePageList){
        episodePageList[j].id === this.state.episode.id
        ? (
            episodePageList[j].isLater = !episodePageList[j].isLater,
            this.props.initplayer.episodePageList = episodePageList
            /*localStorage.setItem('episodePageList', JSON.stringify(episodePageList))*/
          )
        :null
      }
    }
    
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
  onSuccess = (_response) => {
    _response.status === 'success'
    ? (
        localStorage.getItem('scrollY')
        ? (
          alert('scrollY'),
          Utils.scrollTo(200,Utils.offset(document.querySelector('.new')).top-document.querySelector('.breadcrumb').offsetHeight)
        )
        : null,
        this.setState({
          'init':false,
          'loading':false,
          'lan':localStorage.getItem('language'),
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
  onSuccessOrigen = (_response) => {
    _response.status === 'success'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setOrigen(_response){
    localStorage.setItem('lastItemDatastatic',JSON.stringify(_response.data.episode));
    localStorage.setItem('lastPosition',_response.position % _response.perPhase);//indicates the position
    localStorage.setItem('phase_episode_'+_response.data.episode.id, Math.trunc(_response.position / _response.perPhase));
    localStorage.setItem('lastpodcast',_response.data.podcast.id);
    localStorage.setItem('lastpodcastName',_response.data.podcast.name);
    localStorage.setItem('lastItemDataepisode',JSON.stringify(_response.data.podcast));
    localStorage.setItem('lastpodcastLink','/episode/'+_response.data.podcast.id+'/'+_response.data.podcast.name);
    localStorage.setItem('lastChannel',_response.data.channel.id);
    localStorage.setItem('lastChannelLink','/podcast/'+_response.data.channel.id+'/'+_response.data.channel.name);
    localStorage.setItem('lastChannelName',_response.data.channel.name);
    localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response.data.channel));
    localStorage.setItem('phase_opinion_'+_response.data.podcast.id, 0);
    this.props.initplayer.data = _response.data.episode;
    this.props.initplayer.play(_response.data.episode.file, _response.data.episode.id, _response.data.episode.name, _response.data.episode);
    window.location.href = './#/static/'+_response.data.episode.id+'/'+_response.data.episode.name;
  }
  getOrigen(_p){
    Utils.scrollToTop(300);
    window.setSpinner();
    API.action('getEpisodeOrigen', { 'id' : _p.id }, this.onSuccessOrigen, this.onError, 'GET', false, true);
  }
  componentDidMount(){
    this.setState({
      'dataOrigen':localStorage.getItem('lastChannelName'),
      'origen': 'podcast'
    })
    API.action('getNewChannel', {'id' : this.props.origen }, this.onSuccess, this.onError, 'GET', false, true);
  }
  componentWillUpdate(){
    
  }
  setDescript(string, limit) {
    if(string.length > limit){
        for(let i = limit; i > 0; i--){
            if(string.charAt(i) === ' ' && (string.charAt(i-1) != ','||string.charAt(i-1) != '.'||string.charAt(i-1) != ';')) {
                return string.substring(0, i) + '...'
            }
        }
    }else{
        return string
    }
  }
  
  render() {
    var lan = localStorage.getItem('language');
    let NewList ;
    
    if(typeof this.state.data !== 'undefined'){
      NewList = this.state.data;
    }else{
      NewList  = [];
    }
    return (
      <div className='new' >
        <div className='row'>
          <div className='col-xs-12 col-md-12'>
            <div className='new_rot' >{this.translate('content.lastEpisodes')} {this.state.dataOrigen}</div>
          </div>
        </div>
        <div className={!NewList.length ? '':'hide'} >{this.translate('user.listEmpty')}</div>
        <div class="row item_responsive" >
            {
              NewList.map((p, index)  => (
                <div className="col-xs-12 col-md-4 item_responsive" >
                  <div className ={ (index-1)%3===0 ? 'item_container' : index%3===0 ? 'item_container_left' : 'item_container_right'} >
                    <div className={ p.id === localStorage.getItem('lastepisode') ? "contentSelected" : "" } >
                        <div className="row item new_item"  style={ 'background-image:url("' + this.state.cms + p.picture + '")'}  >
                          <div class="desc_cont">
                            <div class="item_actions">
                              <div class="item_actions_episode" id={p.id} name={p.name} onClick={() => this.getOrigen(p)} >
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
                          <div className={this.state.options[index] ? 'item_container_to_lists' : 'hide' }  >
                            <div className='item_container_to_lists_item' id='fav' alt="fav" onClick={ (event, _episode) => this.clickHandlerepisodeFav(event, p) } >{this.translate('user.toFavourites')}</div>
                            <div className='item_container_to_lists_item' id='later' alt="later" onClick={ (event, _episode) => this.clickHandlerepisodeLater(event, p) } >{this.translate('user.toLater')}</div>
                            {/*<div className='item_container_to_lists_item' id='share' onClick={ (event, _episode) => this.clickHandlerepisodeShare(event, p) }>{this.translate('user.toSubscribe')}</div>*/}
                            <div className='item_container_to_lists_item' id='share' src={share} alt="share" onClick={ (event, _episode) => this.clickHandlerepisodeShare(event, p) } >{this.translate('user.share')}</div>
                            <div className='item_container_to_lists_close' onClick={() => this.clickHandlerClose(index)} ><span class="icon-x"></span></div>
                          </div>
                        </div>
                        <div className="new_item_rot">
                          {p.name}
                        </div>
                      
                        <div className="new_item_desc">
                            {
                              this.setDescript(p.description, 150)
                            }
                        </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        
        <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
        <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );
  }
}

NewChannel.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(NewChannel);
export default NewChannel;