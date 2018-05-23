import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import PlayerApp from '../../components/Player/PlayerApp/PlayerApp.js'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import Iteminfo from '../../components/Iteminfo/Iteminfo.js'
import Opinion from '../../blocks/Opinion/Opinion.js'
import Claim from '../../blocks/Claim/Claim.js'
import New from '../../components/New/New.js'
import Pages from '../../components/Pages/Pages.js'
import SingleLayout from '../../components/SingleLayout/SingleLayout.js'
import later from '../../assets/images/later.png'
import fav from '../../assets/images/fav.png'
import share from '../../assets/images/share.png'
import Stats from '../../components/Stats/Stats.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import Lists from '../../utils/Lists.js'
import './episode.scss'

const _Opinion ={
  refresh(){

  }
}


class Episode extends React.Component {
  constructor(props) {
    super(props);
    console.log('props episode');
    console.log(props);
    console.log(this.props.location.origen);
    typeof props.location !== 'undefined'
    ? localStorage.setItem('lastState',props.location.pathname)
    : null;
    this.state = {
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'schemmaShow':false,
      'schemma':[],
      'data':[ ],
      'podcast': typeof this.props.match === 'undefined' ? 'FORBESDAILY' : typeof this.props.match.params.podcast === 'undefined' ? ( localStorage.getItem('lastpodcast') ? localStorage.getItem('lastpodcast') : 'FORBESDAILY' ) : this.props.match.params.podcast,
      'options':[],
      'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 ,
      'total':0,
      'itemInfo':JSON.parse(localStorage.getItem('lastItemDataepisode')) //this.props.location.data
    }
    localStorage.setItem('lastpodcastLink',this.props.location.pathname);
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
    this.setPhase = this.setPhase.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.getOrigen = this.getOrigen.bind(this);
  }
  onSuccess = (_response) => {
    Utils.scrollToTop(300);
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
    episodePageList = this.props.initplayer.episodePageList; /*episodePageList = JSON.parse(localStorage.getItem('episodePageList'));*/
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
  setPhase(_phase){
    window.setSpinner();//,
    API.action('getListEpi', { 'id' : this.state.podcast, 'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastpodcast'))) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
  }
  initPlayer(_episode, _position){
    localStorage.setItem('lastPosition',_position);
    localStorage.setItem('lastItemDatastatic',JSON.stringify(_episode));
    this.props.initplayer.episodePageList = this.state.data;/*localStorage.setItem('episodePageList',JSON.stringify(this.state.data));*/
    Utils.scrollToTop(300);
    this.props.initplayer.data = _episode;
    this.props.initplayer.play(_episode.file, _episode.id, _episode.name, _episode);
    window.location.href = './#/static/'+_episode.id+'/'+_episode.name;
  }
  componentDidMount(){
    //window.googletag.cmd.push(function() { window.googletag.display('right1'); }) 
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    /*typeof localStorage.getItem('podcast')!=='undefined' && localStorage.getItem('podcast') && localStorage.getItem('lastpodcast') === this.state.podcast
    ? this.setState ({
        'data':JSON.parse(localStorage.getItem('episode'))
      })
    : ( */
      localStorage.setItem('lastpodcast',this.state.podcast );//,
      localStorage.setItem('lastOpinion',this.state.podcast);//,
      window.setSpinner();//,
      API.action('getListEpi', { 'id' : this.state.podcast, 'phase': parseFloat(localStorage.getItem('phase_episode_'+localStorage.getItem('lastChannelName'))) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
      //)
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
  /*<div class="col-xs-6">
    <div className="desc">
      {p.desc[localStorage.getItem('language')]}
    </div>
  </div>*/
  /*<PlayerApp />*/
  render() {
    let lastPodcastPremium = JSON.parse(localStorage.getItem('lastItemDataepisode')).canal.premium;
    let itemInfo;
    itemInfo =  <Iteminfo data={this.state.itemInfo} destiny='episode' auth={this.props.auth} origen="podcast" dataOrigenLink={localStorage.getItem('lastChannelLink')} dataOrigen={localStorage.getItem('lastChannelName')} initSchemma={this.props.initSchemma} />
    let lan = localStorage.getItem('language');
    let PagesList;
    if(this.state.total>0){
      PagesList = <Pages total={this.state.total} perPhase={this.state.perPhase}  setPhase= {this.setPhase} auth={this.props.auth} list="episode" />
    }
    let ClaimDiv;
    this.props.auth.typeUser !== 'premium'
    ? ClaimDiv = <div className="col-xs-12 col-sm-4" >
                <div id='right1' >
                  
                </div>
                <Claim />
              </div>
    : ClaimDiv = '';
    return (
      <div className={ Utils.checkScene('/episode') ? 'episode' : 'episode resetPaddingBottom' } style={this.state.style} >
        <div className={ Utils.checkScene('/episode') ? 'hide' : 'hide' } >
          <h1>{this.translate('menu.episode').toUpperCase() + ' ' + this.translate('podcast') + ' ' + ( localStorage.getItem('lastpodcastName') ? localStorage.getItem('lastpodcastName') : '' ) }</h1>
        </div>
        <div className='row' >
          <div>
            {itemInfo}
          </div>
        </div>
        <div className={ Utils.checkScene('/episode') ? '' : 'resetPaddingTop' }>
          <div class="row" >
            <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-sm-8" : "col-xs-12" } >
                <div className='row' >
                  <div className='episode_rot mt50'>
                    {this.translate('content.episodes')}
                  </div>
                </div>
                <div className={!this.state.data.length ? '':'hide'} >{this.translate('user.listEmpty')}</div>
                <div class="row item_responsive" > 
                  {
                    this.state.data.map((p, index)  => (
                      <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-md-6 item_responsive" : "col-xs-12 col-md-4 item_responsive" }>
                        <div className ={this.props.auth.typeUser  !=='premium' ? 'item_container' : (index-1)%3===0 ? 'item_container' : index%3===0 ? 'item_container_left' : 'item_container_right'} >
                          <div className={ p.id === localStorage.getItem('lastepisode') ? "contentSelected" : "" } >
                              <div className="row item" >
                                <div className="col-xs-12 ">
                                  <div className="item_origen" onClick={() => this.getOrigen(p.origin.id)}>
                                    {p.origin.name}
                                  </div>
                                </div>
                                <div className="col-xs-12 ">
                                  <div className="rot" onClick={(episode, position) => this.initPlayer(p, index)} >
                                    {/*{index+1+this.state.phase*this.state.perPhase}. */}{p.name}
                                  </div>
                                </div>
                                <div class="desc_cont">
                                  <Stats data={p} origen='episode' auth={this.props.auth} />
                                  <div class="item_actions">
                                    <div class="item_actions_episode" id={p.id} name={p.name} onClick={(episode, position) => this.initPlayer(p, index)} >
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
                          lastPodcastPremium
                          ? <div className="flag_premium" >
                              <div className="flag_premium_ico" ><span class="icon-award" ></span></div>
                            </div>
                          : ''
                        }
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
          <div class="row" >
            <div className="col-xs-12 opinion_col" >
              <Opinion origen={this.props.match.params.podcast} auth={this.props.auth} update={_Opinion} type='podcast' />
            </div>
          </div>
          <div class="row" >
            <div className="col-xs-12 opinion_col" >
              <New origen={this.props.match.params.podcast} auth={this.props.auth} initplayer={this.props.initplayer} />
            </div>
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
Episode.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Episode);
export default Episode;