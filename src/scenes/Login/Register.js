import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import { Link, Route} from 'react-router-dom'
import Intro from './Register/Intro.js'
import Choose from './Register/Choose.js'
import Data from './Register/Data.js'
import Payment from './Register/Payment.js'
import Validate from './Register/Validate.js'
import { Modal, API } from '../../services/Rest.js'
import './Register.scss'

const Card = {
  resize(){

  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'tab':localStorage.getItem('logged') ? 'validate' : 'intro',
      'intro':true,
      'choose':false,
      'data':false,
      'payment':false,
      'type':'Basic',
      'showedMsg': localStorage.getItem('error'),
      'isOpen': localStorage.getItem('error') ? true : false,
      'success':false,
      'oneStep':true
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.tabSelected= this.tabSelected.bind(this);
    this.flow = this.flow.bind(this);
    this.subscription = this.subscription.bind(this);
    this.dataToSend = {};
    this.handleResize = this.handleResize.bind(this);
  }
  tabSelected(_tab){
    switch (_tab){
        case 'intro':
          this.setState({
            'tab':'intro',
            'choose':false,
            'data':false,
            'payment':false
          })
        break;
        case 'choose':
          this.setState({
            'tab':'choose',
            'data':false,
            'payment':false
          })
        break;
        case 'data':
          this.setState({
            'tab':'data',
            'payment':false
          })
        break;
        default:
        break;
    }
  }
  flow(_data,_tab){
    Utils.scrollToTop(300);  
    switch (_tab){
        case 'intro':
          this.dataToSend.nickName = _data.nickName;
          this.dataToSend.first_name = _data.name;
          this.dataToSend.last_name = _data.surname;
          this.dataToSend.email = _data.email;
          this.dataToSend.password = _data.pwd;
          this.dataToSend.repeatPassword = _data.pwdRepit;
          this.state.type === 'Basic'
          ? this.handleSubmit()
          : (
            this.setState({
              'choose':true,
              'tab':'choose'
            }),
            setTimeout(function(){ Card.resize(); }, 10)
          )

        break;
        case 'choose':
          this.dataToSend.type = _data.type;
          /*this.setState({
            'data':true,
            'tab':'data'
          })*/
          this.state.type === 'Basic'
          ? this.handleSubmit()
          : this.setState({
              'data':true,
              'tab':'data'
            });
        break;
        case 'data':
          this.dataToSend.typeDoc = _data.typeDoc;
          this.dataToSend.doc = _data.doc;
          this.dataToSend.address = _data.address;
          this.dataToSend.country = _data.country;
          this.dataToSend.province = _data.province;
          this.dataToSend.zip = _data.cp;
          this.dataToSend.city = 'not Still';
          this.setState({
              'payment':true,
              'tab':'payment'
            });
          /*this.state.type === 'Basic'
          ? this.handleSubmit()
          : this.setState({
              'payment':true,
              'tab':'payment'
            });*/
        break;
        case 'payment':
          this.dataToSend.cardNumber = _data.cardNumber;
          this.dataToSend.month = _data.month;
          this.dataToSend.year = _data.year;
          this.dataToSend.cvv = _data.cvv;
          this.dataToSend.code = _data.code;
          this.handleSubmit();
        break;
        default:
        break;
    }
  }
  subscription(_type){
    this.setState({
      'type':_type
    })
  }
  login = (_response) => {
    var subscriptionData = {};
    _response.status === 'success'
    ? (
      /*localStorage.setItem('logged',true),
      console.log(_response),
      localStorage.setItem('email',_response.data.personalData.email),
      localStorage.setItem('client',JSON.stringify(_response.data)),
      localStorage.setItem('token',_response.token),
      window.location.reload()*/
      this.setState({
          isOpen: true,
          showedMsg: 'register.successfull'
      })
    )
    : this.setState({
          isOpen: true,
          showedMsg: 'login.error.' + _response.reason
      });
  }
  onSuccess = (_response) => {
    _response.status === 'success'
    ? ( 
        Utils.scrollToTop(300),
        window.location.href = '/#/registered'
        /*API.action('login', { 'email':this.dataToSend.email, 'pwd':this.dataToSend.pwd}, this.login, this.onError)*/
      )
    : this.setState({
          isOpen: true,
          showedMsg: 'register.' + _response.reason
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
  handleSubmit() {
    console.log(this.dataToSend);
    window.setSpinner();
    this.setState(() => ({
        showedMsg: ''
      }))
    API.action('createAccount', this.dataToSend , this.onSuccess, this.onError, 'GET', false, true);
  }
  componentDidMount(){
    this.props.auth.isAuthenticated
    ? window.location.href = './#'
    : null;
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    });
    Utils.scrollToTop(300);   
  }
  componentWilldMount(){
    window.addEventListener('resize', this.handleResize);
    this.state={
      'tab':'intro',
      'intro':true,
      'choose':false,
      'data':false,
      'payment':false,
      'showedMsg': localStorage.getItem('error'),
      'isOpen': localStorage.getItem('error') ? true : false,
      'success':false
    }
  }
  handleResize(){
    Utils.scrollToTop(300);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

 
  render() {
    return (
        <div className='register_container'  style={this.state.style}>
          <div className={ this.state.tab === 'validate' ? 'hide' : '' } >
            <div className='register_container_rot' >{this.translate('create.account')}</div>
            <div className='mt25 register_container_descriptor' >{this.translate('create.description1')}</div>
            {/*<div className='mt25 register_container_descriptor2' >{this.translate('create.description2')}</div>*/}
          </div>
          <div className={this.state.tab !== 'validate' ? 'mt25 register_container_buttons' : 'hide'} >
            <div className={this.state.tab === 'intro' ? 'register_button register_button_selected' : 'register_button'}  onClick={() => this.tabSelected('intro')} >{this.translate('register.intro').toUpperCase()}</div>
            <div className={ this.state.oneStep ? 'hide' : !this.state.choose ? 'register_button disabled' : this.state.tab === 'choose' ? 'register_button register_button_selected' : 'register_button'} onClick={() => this.tabSelected('choose')} >2. {this.translate('register.choose').toUpperCase()}</div>
            <div className={ this.state.type === 'Basic' ? 'hide' : !this.state.data ? 'register_button disabled' : this.state.tab === 'data' ? 'register_button register_button_selected' : 'register_button'} onClick={() => this.tabSelected('data')} >3. {this.translate('register.data').toUpperCase()}</div>
            <div className={ this.state.type === 'Basic' ? 'hide' : !this.state.payment ? 'register_button disabled' : this.state.tab === 'payment' ? 'register_button register_button_selected' : 'register_button'} onClick={() => this.tabSelected('payment')} >4. {this.translate('register.payment').toUpperCase()}</div>
          </div>
          <div className={this.state.tab !== 'validate' ? 'mt25 register_container_buttons_responsive' : 'hide'} >
            <div className={this.state.tab === 'intro' ? 'register_button register_button_selected' : 'hide'}  onClick={() => this.tabSelected('intro')} >{this.translate('register.intro').toUpperCase()}</div>
            <div className={ !this.state.choose ? 'hide' : this.state.tab === 'choose' ? 'register_button register_button_selected' : 'hide'} onClick={() => this.tabSelected('choose')} >{this.state.type === 'basic' ? '2/3' : '2/4'}  {this.translate('register.choose').toUpperCase()}</div>
            <div className={ !this.state.data ? 'hide' : this.state.tab === 'data' ? 'register_button register_button_selected' : 'hide'} onClick={() => this.tabSelected('data')} >{this.state.type === 'basic' ? '3/3' : '3/4'} {this.translate('register.data').toUpperCase()}</div>
            <div className={ this.state.type === 'Basic' ? 'hide' : !this.state.payment ? 'hide' : this.state.tab === 'payment' ? 'register_button register_button_selected' : 'hide'} onClick={() => this.tabSelected('payment')} >4/4 {this.translate('register.payment').toUpperCase()}</div>
          </div>
          <div className={this.state.tab === 'intro' ? 'register_tab register_tab_selected' : 'register_tab'} ><Intro flow={this.flow} back={this.tabSelected} /></div>
          <div className={this.state.oneStep ? 'hide' : this.state.tab === 'choose' ? 'register_tab register_tab_selected' : 'register_tab'}  ><Choose Card={Card} flow={this.flow} back={this.tabSelected} subscription={this.subscription} /></div>
          <div className={this.state.tab === 'data' ? 'register_tab register_tab_selected' : 'register_tab'} ><Data flow={this.flow} back={this.tabSelected} type={this.state.type} /></div>
          <div className={ this.state.tab === 'payment' ? 'register_tab register_tab_selected' : 'register_tab'} ><Payment flow={this.flow} back={this.tabSelected} /></div>
          <div className={this.state.tab === 'validate' ? 'register_tab register_tab_selected' : 'register_tab'} ><Validate /></div>
          <Modal show={this.state.isOpen} onClose={this.toggleModal} >
            {this.translate(this.state.showedMsg)}
          </Modal>
        </div>
    );
  }
}
Register.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Register);
export default Register;