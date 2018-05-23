import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Stats from '../Stats/Stats.js'
import Lists from '../../utils/Lists.js'
import { Modal, API } from '../../services/Rest.js'
import './Iteminfo.scss'

const bodyScroll = {
  posY:0
}

class Iteminfo extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'data':this.props.data,
      'actions':this.props.actions,
      'origen': this.props.origen
    }
    this.clickHandlerChannelLater = this.clickHandlerChannelLater.bind(this);
    this.clickHandlerFav = this.clickHandlerFav.bind(this);
    this.saveToListFav = this.saveToListFav.bind(this);
    this.onSuccessFav = this.onSuccessFav.bind(this);
    this.clickHandlerSubscribe = this.clickHandlerSubscribe.bind(this); 
    this.saveToListSubscribe = this.saveToListSubscribe.bind(this);
    this.onSuccessSubscribe = this.onSuccessSubscribe.bind(this);
    this.setSchemmaFav = this.setSchemmaFav.bind(this);
    this.setSchemmaLater = this.setSchemmaLater.bind(this);
    this.setSchemmaShare = this.setSchemmaShare.bind(this);  
    this.showMenuResponsive= this.showMenuResponsive.bind(this);
    this.hideMenuResponsive= this.hideMenuResponsive.bind(this);
  }
  setSchemmaLater(){
    this.props.initSchemma.setSchemma = Lists.saveToList(this.state.origen,'later',this.state.data.id);
    this.props.initSchemma.show(this.state.origen,'later',this.state.data);
  }
  clickHandlerChannelLater(event, _channel){
    this.hideMenuResponsive();
    event.stopPropagation();
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
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.setSchemmaLater)
      )
    )
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
      for( var j in lastSearch['podcasts'].result){
        lastSearch['podcasts'].result[j].id === this.state.data.id
        ? lastSearch['podcasts'].result[j].isFavorite = !lastSearch['podcasts'].result[j].isFavorite
        : null
      }
      for( var j in lastSearch['episodes'].result){
        lastSearch['episodes'].result[j].id === this.state.data.id
        ? lastSearch['episodes'].result[j].isFavorite = !lastSearch['episodes'].result[j].isFavorite
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
    this.state.data.isFavorite = !this.state.data.isFavorite;
    this.setState({
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
  clickHandlerSubscribe(event){
    event.stopPropagation();
    this.props.auth.isAuthenticated
    ? this.saveToListSubscribe()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToListSubscribe)
      )
    /*event.stopPropagation();
    this.props.auth.isAuthenticated
    ? this.setSchemmaShare()
    : localStorage.getItem('app')
      ? (
          localStorage.setItem('savingList',true),
          this.props.auth.afterRequiredApp = this.setSchemmaShare,
          window.location.href = './#/login'
        )
      : this.props.auth.required(this.setSchemmaShare)*/
  }
  saveToListSubscribe(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.state.data.isSubscribed
    ? API.action('saveToList', { 'id_item' : this.state.data.id , 'type_item':this.state.origen, 'list':'subscribe', 'value':false }, this.onSuccessSubscribe, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.state.data.id , 'type_item':this.state.origen, 'list':'subscribe', 'value':true }, this.onSuccessSubscribe, this.onError, 'GET', false, true)
  }
  onSuccessSubscribe(){
    var lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
    if(lastSearch){
      for( var j in lastSearch['podcasts'].result){
        lastSearch['podcasts'].result[j].id === this.state.data.id
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
    this.state.data.isSubscribed = !this.state.data.isSubscribed;
    this.setState({
      'refreshing':false
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
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
  componentDidMount() {
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
  componentWillUpdate(){
    var state = localStorage.getItem('lastState').split('/')[1];
    this.setState({
      'data': JSON.parse(localStorage.getItem('lastItemData'+state))
    })
  }
  
  render() {
    let lan = localStorage.getItem('language');
    return (
      typeof this.state.data !== 'undefined'
      ? (
          <div className='iteminfo'>
              <div>
                <div className={'iteminfo_image_container_'+this.props.origen} >
                  <div className ="iteminfo_image" style={ 'background-image:url("' + this.state.cms + this.state.data.image + '")'}  ></div>
                </div>
                <div class="iteminfo_container" >
                  <Link to={typeof this.props.dataOrigenLink !== 'undefined' ? this.props.dataOrigenLink : '/explorar' }><div className="iteminfo_origen" >
                    {typeof this.props.dataOrigen !== 'undefined' ? this.props.dataOrigen : this.translate('header.explore')}
                  </div></Link>
                  <div className="iteminfo_name" >
                    {this.state.data.name}
                  </div>
                </div>
              </div>
              <div>
                <div className={'iteminfo_image_container_wrapper_'+this.props.origen} >
                </div>
                <div class="iteminfo_container_desc" >
                  <div className="iteminfo_desc">
                    {this.state.data.description}
                  </div>
                  <div>
                    <Stats data={this.state.data} origen={this.props.origen} auth={this.props.auth} />
                  </div>
                  <div className='item_info_container_to_lists mb25' >
                    {
                      this.props.origen === 'channel'
                      ? (
                          <div>
                            <div className='item_info_container_to_lists_item' id='share' onClick={ (event, _item) => this.clickHandlerChannelShare(event, this.state.data) } >{this.translate('user.share')}</div>
                          </div>
                        )
                      : (
                          <div>
                            <div className={this.state.data.isFavorite ? 'item_info_container_to_lists_item item_info_container_to_lists_item_true' : 'item_info_container_to_lists_item'}  id='fav' onClick={ (event) => this.clickHandlerFav(event)  }  >{this.state.data.isFavorite ? this.translate('user.favourite') : this.translate('user.toFavourites')}</div>
                            {/*<div className='item_info_container_to_lists_item' id='later' onClick={ (event, _item) => this.clickHandlerChannelLater(event, this.state.data) } >{this.translate('user.toLater')}</div>*/}
                            <div className={this.state.data.isSubscribed ? 'item_info_container_to_lists_item item_info_container_to_lists_item_true' : 'item_info_container_to_lists_item'} id='subscribe' onClick={ (event, _item) => this.clickHandlerSubscribe(event, this.state.data) } >{this.state.data.isSubscribed ? this.translate('user.subscribed') : this.translate('user.toSubscribe')}</div>
                            <div className='item_info_container_to_lists_item' id='share' onClick={ (event, _item) => this.clickHandlerSubscribe(event, this.state.data) } >{this.translate('user.share')}</div>
                            <div className='item_info_container_to_lists_item' id='share'  onClick={this.showMenuResponsive} >
                              <span class="icon-more-horizontal"></span>
                              <span>{this.translate('more')}</span>
                            </div>
                          </div>
                        )
                    }
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

Iteminfo.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Iteminfo);
export default Iteminfo;