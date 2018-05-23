import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import Claim from '../../blocks/Claim/Claim.js'
import SingleLayout from '../../components/SingleLayout/SingleLayout.js'
import later from '../../assets/images/later.png'
import fav from '../../assets/images/fav.png'
import share from '../../assets/images/share.png'
import Stats from '../../components/Stats/Stats.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import Lists from '../../utils/Lists.js'
import './last.scss'



class Last extends React.Component {
  constructor(props) {
    super(props);
    console.log('props episode');
    console.log(props);
    this.state = {
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'schemmaShow':false,
      'schemma':[],
      'data':[ ],
      'podcast': typeof this.props.match === 'undefined' ? 'FORBESDAILY' : typeof this.props.match.params.podcast === 'undefined' ? ( localStorage.getItem('lastpodcast') ? localStorage.getItem('lastpodcast') : 'FORBESDAILY' ) : this.props.match.params.podcast,
      'options':[],
      'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 ,
      'total':0
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
    this.clickHandlerOpen = this.clickHandlerOpen.bind(this);
    this.clickHandlerClose = this.clickHandlerClose.bind(this);
    this.onSuccessOrigenEpisode = this.onSuccessOrigenEpisode.bind(this);
  }
  onSuccess = (_response) => {
    _response.status === 'success'
    ? ( 
      this.setState ({
        'data':_response.result,
        'total':_response.total,
        'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 ,
        'perPhase':_response.perPhase
      }),
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
  onSuccessOrigen = (_response) => {
    _response.status === 'success'
    ? this.setOrigenPodcast(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setOrigenPodcast(_response){
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
  getOrigen(_origen){
    Utils.scrollToTop(300);
    window.setSpinner();
    API.action('getPodcastOrigen', { 'id' : _origen }, this.onSuccessOrigen, this.onError, 'GET', false, true);
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
    /*episodePageList = JSON.parse(localStorage.getItem('episodePageList'));*/
    episodePageList =  this.props.initplayer.episodePageList;
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
  onSuccessOrigenEpisode = (_response) => {
    _response.status === 'success'
    ? this.setOrigenEpisode(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setOrigenEpisode(_response){
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

  }
  getOrigenEpisode(_p){
    Utils.scrollToTop(300);
    window.setSpinner();
    API.action('getEpisodeOrigen', { 'id' : _p.id }, this.onSuccessOrigenEpisode, this.onError, 'GET', false, true);
  }
  
  componentDidMount(){
      window.setSpinner();//,
      API.action('lastEpisodes', { }, this.onSuccess, this.onError, 'GET', false, true);
      //)
  }
  componentWillUnmount() {
   
  }
  
  /*<div class="col-xs-6">
    <div className="desc">
      {p.desc[localStorage.getItem('language')]}
    </div>
  </div>*/
  /*<PlayerApp />*/
  render() {
    let lan = localStorage.getItem('language');
    let ClaimDiv;
    this.props.auth.typeUser !== 'premium'
    ? ClaimDiv = <div className="col-xs-12 col-sm-4" >
                <div id='right1' >
                  
                </div>
                <Claim />
              </div>
    : ClaimDiv = '';
    return (
      <div className='last'  >
        <div>
          <div class="row" >
            <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-sm-8" : "col-xs-12" } >
                <div>
                  <div className="channels_rot" >{this.translate('blocks.last').toUpperCase()}</div>
                </div>
                <div class="row item_responsive" > 
                  {
                    this.state.data.map((p, index)  => (
                      <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-md-6 item_responsive" : "col-xs-12 col-md-4 item_responsive" }>
                        <div className ={this.props.auth.typeUser  !=='premium' ? 'item_container' : (index-1)%3===0 ? 'item_container' : index%3===0 ? 'item_container_left' : 'item_container_right'} >
                          <div >
                              <div className="row item" >
                                <div className="col-xs-12 ">
                                  <div className="item_origen" onClick={() => this.getOrigen(p.origin.id)}>
                                    {p.origin.name}
                                  </div>
                                </div>
                                <div className="col-xs-12 ">
                                  <div className="rot" onClick={(episode) => this.getOrigenEpisode(p)} >
                                    {/*{index+1}. */}{p.name}
                                  </div>
                                </div>
                                <div class="desc_cont">
                                  <Stats data={p} origen='episode' auth={this.props.auth} />
                                  <div class="item_actions">
                                    <div class="item_actions_episode" id={p.id} name={p.name} onClick={(episode) => this.getOrigenEpisode(p)} >
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
                        {
                          p.isPremium
                          ? <div className="flag_premium" >
                              <div className="flag_premium_ico" ><span class="icon-award" ></span></div>
                            </div>
                          : ''
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
              {ClaimDiv} 
          </div>
        </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div> 
    );
  }
}
//<div className={this.state.schemmaShow ? 'ListSchemma show':'ListSchemma' } ><ListSchemma schemma={this.state.schemma} /></div>
Last.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Last);
export default Last;