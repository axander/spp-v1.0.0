import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import SingleLayout from '../../components/SingleLayout/SingleLayout.js'
import Iteminfo from '../../components/Iteminfo/Iteminfo.js'
import Opinion from '../../blocks/Opinion/Opinion.js'
import Claim from '../../blocks/Claim/Claim.js'
import NewChannel from '../../components/New/NewChannel.js'
import Pages from '../../components/Pages/Pages.js'
import later from '../../assets/images/later.png'
import fav from '../../assets/images/fav.png'
import share from '../../assets/images/share.png'
import Stats from '../../components/Stats/Stats.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import Lists from '../../utils/Lists.js'
import ListSchemma from '../../components/Lists/ListSchemma.js'
import './podcast.scss';

const _Opinion ={
  refresh(){

  }
}

class Podcast extends React.Component {
  constructor(props) {

    super(props);
    console.log('props podcast');
    console.log(props);
    typeof props.location !== 'undefined'
    ? localStorage.setItem('lastState',props.location.pathname)
    : null;
    this.state = {
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'data':[ ],
      'channel': typeof this.props.match === 'undefined' ? 'F4RB2S' : typeof this.props.match.params.channel === 'undefined' ? ( localStorage.getItem('lastChannel') ? localStorage.getItem('lastChannel') : 'F4RB2S' ) : this.props.match.params.channel,
      'options':[],
      'phase': parseFloat(localStorage.getItem('phase_podcast_'+localStorage.getItem('lastChannel'))) || 0,
      'total':0,
      'origenData':{}
    }
    localStorage.setItem('lastChannelLink',this.props.location.pathname);
    this.options =[];
    this.clickHandler = this.clickHandler.bind(this);
    this.clickHandlerpodcastLater = this.clickHandlerpodcastLater.bind(this);
    this.clickHandlerpodcastFav = this.clickHandlerpodcastFav.bind(this);
    this.saveToListFav = this.saveToListFav.bind(this);
    this.onSuccessFav = this.onSuccessFav.bind(this);
    this.clickHandlerpodcastShare = this.clickHandlerpodcastShare.bind(this); 
    this.clickHandlerpodcastSubscribe = this.clickHandlerpodcastSubscribe.bind(this);     
    this.saveToListSubscribe = this.saveToListSubscribe.bind(this);
    this.onSuccessSubscribe = this.onSuccessSubscribe.bind(this);
    this.setSchemmaFav = this.setSchemmaFav.bind(this);
    this.setSchemmaLater = this.setSchemmaLater.bind(this);
    this.setSchemmaShare = this.setSchemmaShare.bind(this);
    this.clickHandlerOpen = this.clickHandlerOpen.bind(this);
    this.clickHandlerClose = this.clickHandlerClose.bind(this);
    this.setPhase = this.setPhase.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  onSuccess = (_response) => {
    Utils.scrollToTop(300);
    _response.status === 'success'
    ? ( 
      this.setState ({
        'data':_response.result,
        'total':_response.total,
        'phase':parseFloat(localStorage.getItem('phase_podcast_'+localStorage.getItem('lastChannel'))) || 0,
        'perPhase':_response.perPhase
      }),
      localStorage.setItem('podcast', JSON.stringify(_response.result))
    )
    : this.setState({
        isOpen: true,
        showedMsg: 'podcast.' + _response.reason
    });
  }
  onSuccessOrigen = (_response) => {
    _response.status === 'successfull'
    ? ( 
      localStorage.setItem('lastChannel',_response.data.channel.id),
      localStorage.setItem('lastChannelLink','/podcast/'+_response.data.channel.id+'/'+_response.data.channel.name),
      localStorage.setItem('lastChannelName',_response.data.channel.name),
      window.location.href = './#/podcast/'+_response.data.channel.id+'/'+_response.data.channel.name
    )
    : this.setState({
        isOpen: true,
        showedMsg: 'podcast.' + _response.reason
    });
  }
  getOrigen(_origen){
    API.action('getChannelOrigen', { 'podcast' : _origen }, this.onSuccessOrigen, this.onError, 'GET');
  }
  clickHandler(event, _p){
    
    event.target.id !== localStorage.getItem('lastpodcast')
    ? (
        localStorage.setItem('lastItemDataepisode', JSON.stringify(_p)),
        localStorage.setItem('lastpodcastName', _p.name),
        localStorage.removeItem('lastepisode')
      )
    : null;
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
  setSchemmaLater(){
    this.props.initSchemma.setSchemma = Lists.saveToList('podcast','later',this.state.podcast.id);
    this.props.initSchemma.show('podcast','later',this.state.podcast);
  }
  clickHandlerpodcastLater(event, _podcast){
    event.stopPropagation();
    this.state.podcast = _podcast;
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
    )
  }
  setSchemmaFav(){
    this.props.initSchemma.setSchemma = Lists.saveToList('podcast','fav',this.state.podcast.id);
    this.props.initSchemma.show('podcast','fav',this.state.podcast);
  }
  clickHandlerpodcastFav(event, _podcast){
    event.stopPropagation();
    this.state.podcast = _podcast;
    this.props.auth.isAuthenticated
    ? this.saveToListFav()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToListFav)
     )

    /*
    this.props.auth.isAuthenticated
    ? this.setSchemmaFav()
    : (
      localStorage.setItem('savingList',true),
      localStorage.getItem('app')
      ? (
          this.props.auth.afterRequiredApp = this.setSchemmaFav,
          window.location.href = './#/login'
        )
      : this.props.auth.required(this.setSchemmaFav);
    )
    */
  }
  saveToListFav(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.podcast.isFavorite
    ? API.action('saveToList', { 'id_item' : this.state.podcast.id , 'type_item':'podcast', 'list':'fav', 'value':false }, this.onSuccessFav, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.podcast.id , 'type_item':'podcast', 'list':'fav', 'value':true }, this.onSuccessFav, this.onError, 'GET', false, true)
  }
  onSuccessFav(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    if(lastSearch){
      for( var j in lastSearch['podcasts'].result){
        lastSearch['podcasts'].result[j].id === this.state.podcast.id
        ? lastSearch['podcasts'].result[j].isFavorite = !lastSearch['podcasts'].result[j].isFavorite
        : null
      }
      localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
    }
    var lastItemDataepisode = JSON.parse(localStorage.getItem('lastItemDataepisode'));
    lastItemDataepisode
    ? ( 
      lastItemDataepisode.isFavorite = !lastItemDataepisode.isFavorite,
      localStorage.setItem('lastItemDataepisode', JSON.stringify(lastItemDataepisode))
      )
    :null;
    this.state.podcast.isFavorite = !this.state.podcast.isFavorite;
    this.setState({
      'refreshing':false
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
  }
  setSchemmaShare(){
    this.props.initSchemma.setSchemma = Lists.saveToList('podcast','share',this.state.podcast.id);
    this.props.initSchemma.show('podcast','share',this.state.podcast);
  }
  clickHandlerpodcastShare(event, _podcast){
    event.stopPropagation();
    this.state.podcast = _podcast
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
  clickHandlerpodcastSubscribe(event, _podcast){
    event.stopPropagation();
    this.state.podcast = _podcast
    this.props.auth.isAuthenticated
    ? this.saveToListSubscribe()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToListSubscribe)
      )
  }
  saveToListSubscribe(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.podcast.isSubscribed
    ? API.action('saveToList', { 'id_item' : this.state.podcast.id , 'type_item':'podcast', 'list':'subscribe', 'value':false }, this.onSuccessSubscribe, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.podcast.id , 'type_item':'podcast', 'list':'subscribe', 'value':true }, this.onSuccessSubscribe, this.onError, 'GET', false, true)
  }
  onSuccessSubscribe(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    if(lastSearch){
      for( var j in lastSearch['podcasts'].result){
        lastSearch['podcasts'].result[j].id === this.state.podcast.id
        ? lastSearch['podcasts'].result[j].isSubscribed = !lastSearch['podcasts'].result[j].isSubscribed
        : null
      }
      localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
    }
    var lastItemDataepisode = JSON.parse(localStorage.getItem('lastItemDataepisode'));
    lastItemDataepisode
    ? ( 
      lastItemDataepisode.isSubscribed = !lastItemDataepisode.isSubscribed,
      localStorage.setItem('lastItemDataepisode', JSON.stringify(lastItemDataepisode))
      )
    :null;
    this.state.podcast.isSubscribed = !this.state.podcast.isSubscribed;
    this.setState({
      'refreshing':false
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
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
    API.action('getListPod', { 'id' : this.state.channel , 'phase': parseFloat(localStorage.getItem('phase_podcast_'+localStorage.getItem('lastChannel'))) }, this.onSuccess, this.onError, 'GET', false, true);
  }
  componentDidMount(){
    //window.googletag.cmd.push(function() { window.googletag.display('right1'); }) 
    window.addEventListener('resize', this.handleResize);
    Utils.scrollToTop(300);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })

    /*typeof localStorage.getItem('podcast')!=='undefined' && localStorage.getItem('podcast') && localStorage.getItem('lastChannel') === this.state.channel
    ? this.setState ({
        'data':JSON.parse(localStorage.getItem('podcast'))
      })
    : ( */
      localStorage.setItem('lastChannel',this.state.channel);//,
      localStorage.setItem('lastOpinion',this.state.channel);//,
      window.setSpinner();//,
      API.action('getListPod', { 'id' : this.state.channel , 'phase': parseFloat(localStorage.getItem('phase_podcast_'+localStorage.getItem('lastChannel'))) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
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
  render() {
    let lan = localStorage.getItem('language');
    let PagesList;
    if(this.state.total>0){
      PagesList = <Pages total={this.state.total} perPhase={this.state.perPhase} setPhase= {this.setPhase} auth={this.props.auth} list="podcast" />
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
      <div className={ Utils.checkScene('/podcast') ? 'podcast' : 'podcast resetPaddingBottom' } style={this.state.style} >
        <div className={ Utils.checkScene('/podcast') ? 'hide' : 'hide' } >
          <h1>{this.translate('menu.podcast').toUpperCase() + ' ' + this.translate('channel') + ' ' + ( localStorage.getItem('lastChannelName') ? localStorage.getItem('lastChannelName') : ''  ) }</h1>
        </div>
        <div class="row" >
          <div>
            <Iteminfo data={JSON.parse(localStorage.getItem('lastChannelData'))} destiny='podcast' auth={this.props.auth} origen="channel" initSchemma={this.props.initSchemma} />
          </div>
        </div>
        <div className={ Utils.checkScene('/podcast') ? '' : 'resetPaddingTop' }>
          <div class="row">
            <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-sm-8" : "col-xs-12" } >
              <div className="podcast_rot" >
                {this.translate('menu.podcast').toUpperCase() }
              </div>
              <div className={!this.state.data.length ? '':'hide'} >{this.translate('user.listEmpty')}</div>
              <div class="row item_responsive" >
                {
                  this.state.data.map((p, index) => (
                    <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-md-6 item_responsive" : "col-xs-12 col-md-4 item_responsive" }>
                        <div className ={this.props.auth.typeUser  !=='premium' ? 'item_container' : (index-1)%3===0 ? 'item_container' : index%3===0 ? 'item_container_left' : 'item_container_right'} >
                          <div className={ p.id === localStorage.getItem('lastpodcast') ? "contentSelected" : "" }>
                              <div className="row item" ><div className="col-xs-12 ">
                                {/*<div className="col-xs-12 ">
                                  <div className="item_origen" onClick={() => this.getOrigen(p.origen.id)}>
                                    {p.origen.name[lan]}
                                  </div>
                                </div>*/}
                                </div>
                                <div className="col-xs-12 ">
                                  <div className="rot">
                                    <Link class="item_actions_podcast" to={
                                          {
                                            pathname:'/episode/'+p.id+'/'+p.name,
                                            data:p,
                                            'destiny':'episode',
                                            'schemma':this.props.initSchemma
                                          }
                                        }   id={p.id}  onClick={ (event, _name) => this.clickHandler(event, p)}  >
                                      {index+1+this.state.phase*this.state.perPhase}. {p.name}
                                    </Link>
                                  </div>
                                </div>
                                <div class="desc_cont">
                                  <Stats data={p} origen='podcast' auth={this.props.auth} />
                                  <div class="item_actions">
                                    <Link class="item_actions_podcast" to={
                                          {
                                            pathname:'/episode/'+p.id+'/'+p.name,
                                            data:p,
                                            'destiny':'episode',
                                            'schemma':this.props.initSchemma
                                          }
                                        }   id={p.id}  onClick={ (event, _name) => this.clickHandler(event, p)}  >
                                      <div>
                                        <div class='basicOuter'>
                                          <div class='basicInner'>
                                            <div className="item_desc" name={p.name} style={ 'background-image:url("' + this.state.cms + p.image + '")'} >
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="item_action_rot" >
                                        <div>
                                          <div class='basicOuter'>
                                            <div class='basicInner'>
                                              <div class='item_actions_text' >
                                                {this.translate('goPodcast')}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <div class='basicOuter'>
                                            <div class='basicInner'>
                                              <span class="icon-chevron-right"></span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
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
                                  <div className={ p.isFavorite ? 'item_container_to_lists_item item_container_to_lists_item_true' : 'item_container_to_lists_item' }   id='fav' fav={p.isFavorite} onClick={ (event, _podcast) => this.clickHandlerpodcastFav(event, p) } >{p.isFavorite ? this.translate('user.favourite') : this.translate('user.toFavourites')}</div>
                                  {/*<div className='item_container_to_lists_item' id='later' onClick={ (event, _podcast) => this.clickHandlerpodcastLater(event, p) }  >{this.translate('user.toLater')}</div>*/}
                                  <div className={ p.isSubscribed ? 'item_container_to_lists_item item_container_to_lists_item_true' : 'item_container_to_lists_item' }  id='share' subscribed={p.isSubscribed} onClick={ (event, _podcast) => this.clickHandlerpodcastSubscribe(event, p) }  >{p.isSubscribed ? this.translate('user.subscribed') : this.translate('user.toSubscribe')}</div>
                                  <div className='item_container_to_lists_item' id='share' onClick={ (event, _podcast) => this.clickHandlerpodcastShare(event, p) }  >{this.translate('user.share')}</div>
                                  <div className='item_container_to_lists_close' onClick={() => this.clickHandlerClose(index)} ><span class="icon-x"></span></div>
                                </div>
                              </div>
                          </div>
                        </div>
                        {
                          p.canal.premium
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
                  {/*{PagesList}*/}
                </div>
              </div>
            </div>
            {ClaimDiv} 
          </div>
          <div class="row" >
            <div className="col-xs-12 opinion_col" >
              <Opinion origen={this.props.match.params.channel} auth={this.props.auth} update={_Opinion} type='channel' />
            </div>
          </div>
          <div class="row" >
            <div className="col-xs-12 opinion_col" >
              <NewChannel origen={localStorage.getItem('lastChannel')} auth={this.props.auth} initplayer={this.props.initplayer} />
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

Podcast.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Podcast);
export default Podcast;