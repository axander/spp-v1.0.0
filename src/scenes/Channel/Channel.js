import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import Pages from '../../components/Pages/Pages.js'
import Last from '../../blocks/Last/Last.js'
import Claim from '../../blocks/Claim/Claim.js'
import Travel from '../../blocks/Travel/Travel.js'
import SingleLayout from '../../components/SingleLayout/SingleLayout.js'
import later from '../../assets/images/later.png'
import fav from '../../assets/images/fav.png'
import share from '../../assets/images/share.png'
import Stats from '../../components/Stats/Stats.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import Lists from '../../utils/Lists.js'
import './channel.scss'

class Channel extends React.Component {
  constructor(props) {
    super(props);
    console.log('props channel');
    console.log(props);
    typeof props.location !== 'undefined'
    ? localStorage.setItem('lastState',props.location.pathname)
    : null;
    this.state = {
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'data':[ ],
      'options':[],
      'phase': localStorage.getItem('phase_channel') || 0,
      'total':0
    }
    localStorage.setItem('lastpodcastLink',this.props.location.pathname);
    this.options =[];
    this.clickHandler = this.clickHandler.bind(this);
    this.clickHandlerChannelLater = this.clickHandlerChannelLater.bind(this);
    this.clickHandlerChannelFav = this.clickHandlerChannelFav.bind(this);
    this.clickHandlerChannelShare = this.clickHandlerChannelShare.bind(this); 
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
        'phase':localStorage.getItem('phase_channel') || 0,
        'perPhase':_response.perPhase
      }),
      localStorage.setItem('channels', JSON.stringify(_response.result))
    )
    : this.setState({
        isOpen: true,
        showedMsg: 'channels.' + _response.reason
    });
  }
  clickHandler(event, _p){
    this.props.auth.typeContent=_p.premium;
    Utils.scrollToTop(300);
    event.target.id !== localStorage.getItem('lastChannel')
    ? (
        localStorage.setItem('lastChannel',_p.id),
        localStorage.removeItem('lastpodcast'),
        localStorage.removeItem('lastepisode'),
        localStorage.setItem('lastChannelName', _p.name),
        localStorage.setItem('lastChannelData', JSON.stringify(_p))
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
    this.props.initSchemma.setSchemma = Lists.saveToList('channel','later',this.state.channel.id);
    this.props.initSchemma.show('channel','later',this.state.channel);
  }
  clickHandlerChannelLater(event, _channel){
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
      : this.props.auth.required(this.setSchemmaLater)
    )
  }
  setSchemmaFav(){
    this.props.initSchemma.setSchemma = Lists.saveToList('channel','fav',this.state.channel.id);
    this.props.initSchemma.show('channel','fav',this.state.channel);
  }
  clickHandlerChannelFav(event, _channel){
    event.stopPropagation();
    this.state.channel = _channel;
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
    )
  }
  setSchemmaShare(){
    this.props.initSchemma.setSchemma = Lists.saveToList('channel','share',this.state.channel.id);
    this.props.initSchemma.show('channel','share',this.state.channel);
  }
  clickHandlerChannelShare(event, _channel){
    event.stopPropagation();
    this.state.channel = _channel;
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
    this.props.auth.isAuthenticated
    ? API.action('getListChan', { 'phase': localStorage.getItem('phase_channel') || 0 }, this.onSuccess, this.onError, 'get', false, true)
    : API.action('getListChanMarketing', { 'phase': localStorage.getItem('phase_channel') || 0 }, this.onSuccess, this.onError, 'get', false, true)
    window.setSpinner();
  }
  componentDidMount(){
    //window.googletag.cmd.push(function() { window.googletag.display('right1'); }) 
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    /*typeof localStorage.getItem('channels')!=='undefined'  && localStorage.getItem('channels')
    ? this.setState ({
        'data':JSON.parse(localStorage.getItem('channels'))
      })
    : ( */
      this.props.auth.isAuthenticated
      ? API.action('getListChan', { 'phase': localStorage.getItem('phase_channel') || 0 }, this.onSuccess, this.onError, 'get', false, true)
      : API.action('getListChanMarketing', { 'phase': localStorage.getItem('phase_channel') || 0 }, this.onSuccess, this.onError, 'get', false, true)
      window.setSpinner();
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
  /*{p.desc[localStorage.getItem('language')]}*/
  render() {
    let PagesList;
    if(this.state.total>0){
      PagesList = <Pages total={this.state.total} perPhase={this.state.perPhase} setPhase= {this.setPhase} auth={this.props.auth} list="channel" />
    }
    return (
      <div className={ Utils.checkScene('/channel') ? 'channel' : 'channel resetPaddingBottom' } style={this.state.style} >
        <div className={ Utils.checkScene('/channel') ? 'hide' : 'hide' } >
          <h1>{this.translate('menu.channel').toUpperCase()}</h1>
        </div>
        <div>
          <Last auth={this.props.auth} initplayer={this.props.initplayer} />
        </div>
        <div>
          <Travel />
        </div>
       
        <div className={ Utils.checkScene('/channel') ? '' : 'resetPaddingTop' }>
        <div class="row channel_module" >
          <div className="col-xs-12">
              <div>
                <div className="channels_rot" >{this.translate('menu.channel').toUpperCase()}</div>
              </div>
              <div class="row item_responsive"  >
                {
                  this.state.data.map((p, index) => (
                      <div className="col-xs-12 col-md-4 item_responsive">
                        <div className ={(index-1)%3===0 ? 'item_container' : index%3===0 ? 'item_container_left' : 'item_container_right'} >
                          <div className={ p.id === localStorage.getItem('lastChannel') ? "contentSelected" : "" } >
                            <div className="row item" >
                              {/*<div className="col-xs-12 ">
                                <div className="item_origen">
                                  Origen
                                </div>
                              </div>*/}
                              <div className="col-xs-12 " >
                                <div className="rot" >
                                  <Link class="item_actions_channel" to={
                                              {
                                                pathname:'/podcast/'+p.id+'/'+p.name,
                                                data:p, 
                                                'destiny':'podcast',
                                                'schemma':this.props.initSchemma
                                              }
                                            } id={p.id}  data={p} onClick={ (event, _name) => this.clickHandler(event, p)} >
                                    {index+1+this.state.phase*this.state.perPhase}. {p.name}
                                  </Link>
                                </div>
                              </div>
                              <div class="desc_cont">
                                {/*<Stats data={p} />*/}
                                <div class="item_actions">
                                  <Link class="item_actions_channel" to={
                                              {
                                                pathname:'/podcast/'+p.id+'/'+p.name,
                                                data:p, 
                                                'destiny':'podcast',
                                                'schemma':this.props.initSchemma
                                              }
                                            } id={p.id}  data={p} onClick={ (event, _name) => this.clickHandler(event, p)} >
                                    <div>
                                      <div class='basicOuter'>
                                        <div class='basicInner'>
                                          <div className="item_desc" name={p.name}  style={ 'background-image:url("' + this.state.cms + p.image + '")'} >
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="item_action_rot" >
                                      <div>
                                        <div class='basicOuter'>
                                          <div class='basicInner'>
                                            <div class='item_actions_text' >
                                              {this.translate('goChannel')}
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
                                  {/*<div className='item_container_to_lists_item' id='fav' onClick={ (event, _channel) => this.clickHandlerChannelFav(event, p) } >{this.translate('user.toFavourites')}</div>*/}
                                  {/*<div className='item_container_to_lists_item' id='later' onClick={ (event, _channel) => this.clickHandlerChannelLater(event, p) }  >{this.translate('user.toLater')}</div>*/}
                                  {/*<div className='item_container_to_lists_item' id='share' onClick={ (event, _channel) => this.clickHandlerChannelShare(event, p) }  >{this.translate('user.toSubscribe')}</div>*/}
                                  <div className='item_container_to_lists_item' id='share' onClick={ (event, _channel) => this.clickHandlerChannelShare(event, p) }  >{this.translate('user.share')}</div>
                                  <div className='item_container_to_lists_close' onClick={() => this.clickHandlerClose(index)} ><span class="icon-x"></span></div>
                                </div>
                              </div>
                          </div>
                        </div>
                        {
                          p.premium
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
          </div>
        </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} setPhase={this.setPhase} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div> 
    );
  }
}

Channel.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Channel);
export default Channel;