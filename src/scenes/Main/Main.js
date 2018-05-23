import React from 'react'
import { 
  Switch, 
  Route, 
  Link, 
  Redirect
} from 'react-router-dom'
import Logged from '../../services/Logged.js'
import { Modal, API } from '../../services/Rest.js'
import Settings from '../../components/Settings/Settings.js'
import ListSchemma from '../../components/Lists/ListSchemma.js'
import FBPB from '../../components/FBPB.js'
/*import Dev from '../../components/Dev/Dev.js'*/
import IconMenu from '../../components/IconMenu/IconMenu.js'
import Menu from '../../components/Menu/Menu.js'
import ChannelMenu from '../../components/ChannelMenu/ChannelMenu.js'
import Logout from '../Login/Logout.js'
import Registered from '../Login/Registered.js'
import Recovered from '../Login/Recovered.js'
import RecoveredConfirm from '../Login/RecoveredConfirm.js'
import Info from '../Info/Info.js'
import Recover from '../Login/Recover.js'
import RecoverConfirm from '../Login/RecoverConfirm.js'
import Register from '../Login/Register.js'
import Confirm from '../Login/Confirm.js'
import Home from '../Home/Home.js'
import Home_web from '../Home/web/Home_web.js'
import Header_web from '../Home/web/Header_web.js'
import Footer_web from '../Home/web/Footer_web.js'
import Podcast from '../Podcast/Podcast.js'
import Channel from '../Channel/Channel.js'
import Premium from '../Premium/Premium.js'
import Episode from '../Episode/Episode.js'
import Search from '../Search/Search.js'
import StaticPlayer from '../../components/StaticPlayer/StaticPlayer.js'
/*import PlayerAppDeacoplate from '../../components/Player/PlayerApp/PlayerAppDeacoplate.js'*/
import Terms from '../Terms/Terms.js'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.js'
import MainContainer from './MainContainer.js'
import NeedLogin from './NeedLogin.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import AddPropsToRoute from '../../components/AddPropsToRoute.js'



import PlayerApp from '../../components/Player/PlayerApp/PlayerApp.js'




const fakeAuth = {
  isAuthenticated: Logged.setAuthRefresh() ? true : false,
  authenticate(cb){
    console.log('this.afterRequired');
    console.log(this.afterRequired);
    this.isAuthenticated = true;
    this.afterRequired ? this.afterRequired() : null;
    this.afterRequired = null;
    this.afterRequiredApp ? this.afterRequiredApp() : null;
    this.afterRequiredApp = null;
    
    setTimeout(cb,100);
  },
  signout(cb){
    this.isAuthenticated = false;
    this.resetUser();
    setTimeout(cb,100);
  },
  typeContent : null,
  typeUser : null,
  setUser(_type){
    //it will be configured from Login_web
    this.typeUser = _type;
  },
  resetUser(){
    //it will be configured from Login_web
  },
  hide(){

  },
  required(){

  },
  afterRequired(){

  },
  afterRequiredApp(){

  },
  refreshNick(){
    
  }
}
const statics = {
  data : {}
}
const player = {
  show : true,
  play(){
    //it will be configured from Login_web
  },
  data : {},
  next(){},
  previous(){},
  resetInit(){},
  init : false,
  episodePageList : null
}
const deacoplatePlayer = {
  initPlayer : false,
  ready(){

  },
  getTitle(){

  },
  play(){

  },
  tooglePlay(){

  },
  firstEpisode:null,
  next(){
    return 'empty'
  },
  previous(){
    return 'empty'
  },
  nextDis(){

  },
  previousDis(){

  },
  data(){

  },
  fromStatic:true
}
const listSchemma = {
  show(){
    //it will be configured from Login_web
  },
  setSchemma:[]
}
const PrivateRoute = ({ component: Component, needLogin : NeedLogin,  ...rest }) => (
  <Route {...rest} render={(props) =>(
    fakeAuth.afterRequiredApp = null,
    localStorage.setItem('lastState',props.location.pathname),
    ( fakeAuth.isAuthenticated === true  ) && !localStorage.getItem('error') 
          ? <Component {...props} initplayer={player} auth={fakeAuth} initSchemma={listSchemma} />
          :( 
            fakeAuth.required(),
            <NeedLogin {...props} initplayer={player} auth={fakeAuth} initSchemma={listSchemma} />
          )
    )}/>
)
const header ={
  initSession(){
    
  }
}

class Login extends React.Component{

  constructor(props) {
    super(props);
    console.log('here');
    console.log(props);this.state = { isOpen: true };
    this.state = {
     'email':'',
     'emailClass':'',
     'emailValidation':'',
     'pwd':'',
     'deactive': 'disabled',
     'showedMsg': localStorage.getItem('error'),
     'isOpen': localStorage.getItem('error') ? true : false,
     'loggedFb': localStorage.getItem('extStatus'),
     'statusSubscription':{},
     'lapsedSubscription':{},
     'codesData': {},
     'isOpen': false,
     'showedMsg': '' 
    };
    localStorage.removeItem('error')
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickHandlerFB = this.clickHandlerFB.bind(this);

    this.requireLogin  = this.requireLogin.bind(this);
  }

  handleChange(event) {
    switch(event.target.id){
      case 'email':
          this.setState({[event.target.id]:event.target.value});
          !Utils.validateEmail(event.target.value)
          ? this.setState({
            'emailValidation':this.translate('register.emailNotValid'),
            'emailClass':'notValid_input'
          })
          : this.setState({
            'emailValidation':'',
            'emailClass':''
          })
      break;
      case 'pwd':
          /*this.setState({[event.target.id]:event.target.value});
          this.state.pwd !== this.state.pwdRepit
          ? this.setState({
            'passwordNotMatch':this.translate('register.passwordNotMatch'),
            'pwdClass':'notValid_input'
          })
          : this.setState({
            'passwordNotMatch':'',
            'pwdClass':''
          })*/
      break;
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.setState({[event.target.id]:event.target.value});
    this.state.email !== '' && this.state.pwd !== '' && this.state.emailValidation === ''
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
  }
  state = {
    redirectToReferrer : false
  }
  login = (_response) => {
    var subscriptionData = {};
    _response.status === 'successfull'
    ? (
      localStorage.setItem('logged',true),
      console.log(_response),
      localStorage.setItem('email',_response.data.personalData.email),
      localStorage.setItem('client',JSON.stringify(_response.data)),
      localStorage.setItem('token',_response.token),
      fakeAuth.setUser(_response.data.personalData.type),
      this.setLogged(_response)
    )
    : this.setState({
          isOpen: true,
          showedMsg: 'login.error.' + _response.reason
      });
  }
  setLogged(){
    fakeAuth.required = this.requireLogin;
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  onError = (_response, _error) =>{
    this.setState({
          isOpen: true,
          showedMsg: _error
      });
    /*this.setState(() => ({
        showedMsg: 'ERROR'
      }))*/
  }
  handleSubmit(event, _login, _onError) {
    console.log(this.state);
    window.setSpinner();
    this.setState(() => ({
        showedMsg: ''
      }))
    event.preventDefault();
    //API.action('','GET', { 'user':this.state.user, 'pwd':this.state.pwd}, this.login, this.onError);
    API.action('login', { 'email':this.state.email, 'pwd':this.state.pwd}, this.login, this.onError);
  }
  componentDidUpdate(){
    localStorage.getItem('error')
    ? ( this.setState({
          isOpen: true,
          showedMsg: localStorage.getItem('error')
      }) , localStorage.removeItem('error') )
    :null;
    
  }
  requireLogin(_exec){
    fakeAuth.afterRequired = _exec;
  }
  componentDidMount() {
    fakeAuth.required = this.requireLogin;
  }
  clickHandlerFB(event){
    window.checkLoginState()
  }
  toggleModal = () => {
      this.setState({
          isOpen: !this.state.isOpen
      });
   }
  render(){
    const {redirectToReferrer} = this.state
    const { from } = this.props.location.state || { from: { pathname:'/' } }
    if( redirectToReferrer === true ){
      return(
        <Redirect to={ from } />
      )
    }
    //<div><input type="submit" value={this.translate('continue').toUpperCase()} className="submitBtn" /></div>
    return (
      <div className='mainContainer' >
        <auth>
          <div className='auth'>
            <div className="basicOuter" >
                <div className="basicInner">
                  <h1>{this.translate('login')}</h1>
                  <div><FBPB /></div>
                  <div className="formOr" >------------------   {this.translate('register.or')}   ------------------</div>
                  <form onSubmit={e => this.handleSubmit(e, this.login, this.onError)}>
                    <div><label>{this.translate('email').toUpperCase()}</label></div>
                    <div><input id="email" type="text"  onChange={this.handleChange} className={ this.state.emailClass} value={this.state.email} /></div>
                    <div className="notValid_msg" >{this.state.emailValidation}</div>
                    <div><label>{this.translate('password').toUpperCase()}</label></div>
                    <div><input id="pwd" type="password" onChange={this.handleChange} value={this.state.pwd} /></div>
                    <Link to='/recover' className='contrast'><div>{this.translate('register.recoverPwd')}</div></Link>
                    <div><div className={"submitBtn " + this.state.deactive } onClick={e => this.handleSubmit(e, this.login, this.onError)} >{this.translate('continue').toUpperCase()}</div></div>
                  </form>
                  <Link to='/'><div className="backPB" >{this.translate('back')}</div></Link>
              </div>
            </div>
            <Modal show={this.state.isOpen} onClose={this.toggleModal} >
                {this.translate(this.state.showedMsg)}
              </Modal>
          </div>
        </auth>
      </div> 
    );
  }
}






TranslatedComponent(Login);



class Main extends React.Component {
  constructor(props) {
      super(props);
      this.state = { 
        isOpen: true,
        'statusSubscription':{},
        'lapsedSubscription':{},
        'codesData': {},
        'resetUser': null
      };
      Logged.getLogged(this.props, fakeAuth);
  }
  updateSubscriptions(_subscriptionData, _email){
    this.state.lapsedSubscription = _subscriptionData.lapsed;
    this.state.codesData = _subscriptionData.codesData;
    this.state.statusSubscription = {
      'email': _email,
      'basic': _subscriptionData.lapsed.basic ? 2 : _subscriptionData.status.basic,                
      'invited': _subscriptionData.lapsed.invited ? 2 : _subscriptionData.status.invited,               
      'premium': _subscriptionData.lapsed.premium ? 2 : _subscriptionData.status.premium,
      'code': _subscriptionData.codeInv              
    }
    window.setSpinner();
    API.action('updateSubscription', this.state.statusSubscription, this.updateSubscriptionSuccess, this.updateSubscriptionError);
  }
  updateSubscriptionSuccess = (_response) => {
    /*this.setState({
          isOpen: true,
          showedMsg: this.state.lapsedSubscription.premium ? 'register.premiumLapsed' : this.state.lapsedSubscription.invited ? 'register.invitedLapsed' : 'register.basicLapsed'
      });*/
    var client = JSON.parse(localStorage.getItem('client'));
    client.paymentData.subscription.type.basic.status = this.state.statusSubscription.basic;
    client.paymentData.subscription.type.invited.status = this.state.statusSubscription.invited;
    client.paymentData.subscription.type.premium.status = this.state.statusSubscription.premium;
    client.paymentData.codesFrom = this.state.codesData;
    localStorage.setItem('client',JSON.stringify(client));
    this.state.lapsedSubscription.basic ? localStorage.setItem('proccess','register.basicLapsed') : null;
    this.state.lapsedSubscription.invited ? localStorage.setItem('proccess','register.invitedLapsed') : null;
    this.state.lapsedSubscription.premium ? localStorage.setItem('proccess','register.premiumLapsed') : null;
    window.location.href = './#/user/subscriptionData';
  }
  updateSubscriptionError = (_response, _error) =>{
    this.setState({
          isOpen: true,
          showedMsg: _error
      });
    /*this.setState(() => ({
        showedMsg: 'ERROR'
      }))*/
  }
  componentWillUpdate(){
    /*var subscriptionData = {};
    var client = JSON.parse(localStorage.getItem('client'));
    localStorage.getItem('logged') && !localStorage.getItem('checkingSubscription')
    ? ( 
      //check type of subscription from data
      localStorage.setItem('checkingSubscription', true),
      subscriptionData = Utils.checkSubscription(client.paymentData),
      //check instant lapsed
      subscriptionData.lapsed.premium || subscriptionData.lapsed.invited || subscriptionData.lapsed.basic
        ? this.updateSubscriptions(subscriptionData, client.personalData.email)
        : localStorage.getItem('checkingSubscription') ? localStorage.removeItem('checkingSubscription') : null
    )
    : null;*/
  }
  toggleModal = () => {
      this.setState({
          isOpen: !this.state.isOpen
      });
   }
  componentDidMount(){
    window.googletag.cmd.push(function() { window.googletag.display('right1'); }) ;
    localStorage.getItem('sesion') === 'timeout'
    ? (
      this.setState({
          isOpen: true,
          showedMsg: 'timeout'
      }),
      localStorage.removeItem('sesion')
    )
    : this.setState({
          isOpen: false,
          showedMsg: 'timeout'
      });
  }
  render() {
    if( !localStorage.getItem('app') ){
      fakeAuth.hide();
      return (
        <div className='mainContainer' >
          <div className={'ontouchstart' in document.documentElement ? 'main' : 'main main-noMobile'} > 
            <Route path="/(cancel-premium-process|premium-process-ok|register|terms|info|explorar|podcast|episode|static|confirm|search|recovered|registered|profile|premium|promotional|lists|subscription|bills|deleteAccount|SPP_DEV)/" render={(props) => (
                <Breadcrumb {...props} auth={fakeAuth} />
              )}/>
            <Switch>
              <Route exact path='/' render={(props) => (
                <Home_web {...props} statics={statics} initplayer={player} initSchemma={listSchemma} auth={fakeAuth} />
              )}/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/logout' render={(props) => (
                <Logout {...props} auth={fakeAuth} initplayer={player} />
              )}/>
              
              <Route exact path='/register' render={(props) => (
                <Register {...props} auth={fakeAuth} />
              )}/>
              <Route exact path='/terms' component={Terms}/>
              <Route exact path='/search' render={(props) => (
                <Search {...props} initplayer={player} auth={fakeAuth} />
              )}/>
              <Route exact path='/info' component={Info}/>
              <Route exact path='/info/*' render={(props) => (
                <Info {...props} statics={statics} auth={fakeAuth} />
              )}/>
              <Route exact path='/confirm' component={Confirm}/>
              <Route path='/confirm/:code' component={Confirm}/>
              <Route path='/registered' component={Registered}/>
              <Route exact path='/recovered' component={Recovered}/>
              <Route path='/recovered/confirm/:code' component={RecoveredConfirm}/>
              <Route exact path='/recovered/confirm' component={RecoveredConfirm}/>
              <Route exact path='/recover' component={Recover} />
              <Route exact path='/recover/confirm' component={RecoverConfirm} />
              <Route exact path='/episode' render={(props) => (
                <Episode {...props} initSchemma={listSchemma} initplayer={player} auth={fakeAuth} />
              )}/>
              <Route exact path='/static/:episode/:name' render={(props) => (
                <StaticPlayer {...props} initSchemma={listSchemma}  initplayer={player} auth={fakeAuth}  deacoplatePlayer={deacoplatePlayer} />
              )}/>
              <Route exact path='/episode/:podcast/:name' render={(props) => (
                <Episode {...props} initSchemma={listSchemma}  initplayer={player} auth={fakeAuth} />
              )}/>
              <Route exact path='/episode/:podcast/:name/:episode/:episodename' render={(props) => (
                <Episode {...props} initSchemma={listSchemma}  initplayer={player} auth={fakeAuth} />
              )}/>
              <Route exact path='/explorar' render={(props) => (
                <Channel {...props} initSchemma={listSchemma}  auth={fakeAuth} initplayer={player} />
              )}/>
              <Route exact path='/podcast' render={(props) => (
                <Podcast {...props} initSchemma={listSchemma}  auth={fakeAuth}  />
              )}/>
              <Route exact path='/podcast/:channel/:name' render={(props) => (
                <Podcast {...props} initSchemma={listSchemma}  auth={fakeAuth} initplayer={player} />
              )}/>
              <Route exact path='/premium' render={(props) => (
                <Premium {...props} initSchemma={listSchemma}  auth={fakeAuth} initplayer={player} />
              )}/>

              <Route exact path='/SPP_DEV' component={Home}/>
              <PrivateRoute exact path='/*' component={MainContainer} needLogin={NeedLogin} />

            </Switch>
            
            {<Settings logout={fakeAuth} />}
            <ListSchemma initSchemma={listSchemma} initplayer={player} />
            {<ChannelMenu initSchemma={listSchemma} initplayer={player} auth={fakeAuth} />}
            <Modal show={this.state.isOpen} onClose={this.toggleModal}  >
              {this.translate(this.state.showedMsg)}
            </Modal>
          </div>
          <Header_web login={fakeAuth} header={header} />
          <Footer_web header={header} />
        {/*<div id="playerDeacoplate" className = {!localStorage.getItem('episodePageList') ? 'hide' : '' } >*/}
          <div id="playerDeacoplate" className = { player.show && fakeAuth.isAuthenticated && localStorage.getItem('lastepisode') ? '' : 'hide' } >
            <PlayerApp 
              /*firstEpisode = {this.props.firstEpisode} */
              next={this.props.next} 
              previous={this.props.previous} 
              nextDis={this.props.nextDis} 
              previousDis={this.props.previousDis} 
              data={this.props.episode} 
              fromStatic={true} 
              /*delegate={delegate}*/
              auth={fakeAuth} 
              initplayer ={player} 
              deacoplatePlayer={deacoplatePlayer} />
          </div>



        </div>
      );
    }else {
      fakeAuth.hide();
      return (
        <div>
          <Switch>
            <Route exact path='/' render={(props) => (
              <Home {...props} initplayer={player} initSchemma={listSchemma} auth={fakeAuth} />
            )}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/logout' component={Logout}/>
            <Route exact path='/registered' component={Registered}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/info' component={Info}/>
            <Route exact path='/info/*' render={(props) => (
              <Info {...props} statics={statics} auth={fakeAuth} />
            )}/>
            <Route exact path='/terms' component={Terms}/>
            <Route path='/confirm' component={Confirm}/>
            <Route exact path='/recover' component={Recover} />
            <Route exact path='/recover/confirm' component={RecoverConfirm} />
            <Route exact path='/channel' render={(props) => (
              <Channel {...props} initSchemma={listSchemma} auth={fakeAuth} />
            )}/>
            <Route exact path='/podcast' render={(props) => (
              <Podcast {...props} initSchemma={listSchemma} auth={fakeAuth} />
            )}/>
            <Route exact path='/podcast/:channel/:name' render={(props) => (
              <Podcast {...props} initSchemma={listSchemma} auth={fakeAuth} />
            )}/>
            <Route exact path='/episode' render={(props) => (
              <episode {...props} initplayer={player} initSchemma={listSchemma} auth={fakeAuth} />
            )}/>
            <Route exact path='/episode/:podcast/:name' render={(props) => (
              <episode {...props} initplayer={player} initSchemma={listSchemma} auth={fakeAuth} />
            )}/>
            <Route exact path='/static/:episode/:name' render={(props) => (
              <StaticPlayer {...props} initSchemma={listSchemma}  initplayer={player} auth={fakeAuth}/>
            )}/>
            <Route exact path='/SPP_DEV' component={Home}/>
            <PrivateRoute exact path='/*' component={MainContainer} needLogin={NeedLogin} />

          </Switch>
          <Menu />
          <IconMenu initplayer={player} />
          <Settings logout={fakeAuth} />
          <ListSchemma initSchemma={listSchemma} initplayer={player} />
          <ChannelMenu initplayer={player} initSchemma={listSchemma} auth={fakeAuth}  />
          <Modal show={this.state.isOpen} onClose={this.toggleModal} />
        </div>
      );
    }
    
  }
}
//<PrivateRoute exact path='/*' component={AddPropsToRoute(MainContainer, this.props, fakeAuth )} />
Main.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Main);
export default Main;
