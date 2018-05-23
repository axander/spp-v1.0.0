import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import Utils from '../../utils/Utils.js';
import TranslatedComponent from '../../utils/TranslatedComponent.js';

class Invitations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'isOpen': localStorage.getItem('proccess') === 'subscribing' ? true : false,
      'showedMsg': localStorage.getItem('proccess') === 'subscribing' ? 'register.subscription.invited' : null ,
      'codesTo': JSON.parse(localStorage.getItem('client')).paymentData.codesTo,
      'codesFrom': JSON.parse(localStorage.getItem('client')).paymentData.codesFrom,
      'invitedSubscription': JSON.parse(localStorage.getItem('client')).paymentData.subscription.type.invited.status,
      'email':'',
      'code':'',
      'type':'',//codesTo, codesFrom
      'index':'',
      'codeNotShowed':''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
  }
  handleChange(event) {
    console.log(event.target.id);
    console.log(event.target.value);
    this.setState({
        [event.target.id]:event.target.value
    });
    switch(event.target.id){
      case 'email':
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
      case 'codeNotShowed':
      break;
      default:
      break
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    switch(event.target.getAttribute('type')){
      case 'codeTo':
        Utils.validateEmail(this.state.email)
        ? ( window.setSpinner(),
            this.setState(() => ({
              showedMsg: '',
              type: event.target.getAttribute('type'),
              index: event.target.getAttribute('index'),
              code: event.target.getAttribute('code')
            })),
            API.action('sendCodeInv', { 'email':this.state.email,'code':this.state.code }, this.onSuccess, this.onError)
          )
        : this.setState({
            'isOpen': true,
            'showedMsg': 'register.emailNotValid'
           })
      break;
      case 'codeFrom':
        this.state.invitedSubscription === 1
        ? this.setState({
              'isOpen': true,
              'showedMsg': 'register.invited.still'
             })
        : (
          window.setSpinner(),
          this.setState(() => ({
            showedMsg: '',
            type: event.target.getAttribute('type'),
            index: event.target.getAttribute('index'),
            code: event.target.getAttribute('code'),
            activationDate: new Date().getTime()
          })),
          API.action('setCodeInv', { 'email': localStorage.getItem('email'), 'code':this.state.code, 'activationDate': this.state.activationDate, 'status': 1 }, this.onSuccess, this.onError)
        )
      break;
      case 'codeNotShowed':
        this.state.invitedSubscription === 1
        ? this.setState({
              'isOpen': true,
              'showedMsg': 'register.invited.still'
             })
        : Utils.validateCode(this.state.codeNotShowed)
          ? (
            window.setSpinner(),
            this.setState(() => ({
              showedMsg: '',
              type: 'codeNotShowed',
              code: this.state.codeNotShowed,
              activationDate: new Date().getTime()
            })),
            API.action('setCodeInv', { 'email': localStorage.getItem('email'), 'code':this.state.code, 'activationDate': this.state.activationDate, 'status': 1 }, this.onSuccess, this.onError)
          )
          : this.setState({
              'isOpen': true,
              'showedMsg': 'register.codeNotValid'
             })
      break;
      default:
      break;
    }
   
  }
  sendedCode(){
    var client = JSON.parse(localStorage.getItem('client'))
    client.paymentData.codesTo[this.state.index].status = 1;
    client.paymentData.codesTo[this.state.index].deferred = this.state.email;
    localStorage.setItem('client',JSON.stringify(client));
    this.setState({
      'isOpen': true,
      'showedMsg': 'user.invitations.sent.successfull',
      'codesTo': client.paymentData.codesTo,
     })
  }
  settedCode(){
    var client = JSON.parse(localStorage.getItem('client'))
    client.paymentData.codesFrom[this.state.index].status = 1;
    client.paymentData.codesFrom[this.state.index].activationDate = this.state.activationDate;
    client.paymentData.subscription.type.invited.activationDate = this.state.activationDate;
    client.paymentData.subscription.type.invited.status = 1;
    client.paymentData.subscription.type.invited.code = this.state.code;
    localStorage.setItem('client',JSON.stringify(client));
    this.setState({
      'isOpen': true,
      'invitedSubscription':1,
      'showedMsg': 'user.invitations.setted.successfull',
      'codesFrom': client.paymentData.codesFrom,
     })
  }
  settedCodeNotShowed(){
    var client = JSON.parse(localStorage.getItem('client'));
    client.paymentData.codesFrom.unshift({
      'status':1,
      'invitedSubscription':1,
      'activationDate':this.state.activationDate,
      'code':this.state.codeNotShowed
    });
    client.paymentData.subscription.type.invited.status = 1;
    client.paymentData.subscription.type.invited.activationDate = this.state.activationDate;
    client.paymentData.subscription.type.invited.code = this.state.codeNotShowed;
    localStorage.setItem('client',JSON.stringify(client));
    this.setState({
      'isOpen': true,
      'showedMsg': 'user.invitations.setted.successfull',
      'codesFrom': client.paymentData.codesFrom,
      'codeNotShowed':''
     })
  }
  onSuccess = (_response) => {
    switch(this.state.type){
      case 'codeTo':
        _response.status === 'successfull'
        ? this.sendedCode()
        : this.setState({
              isOpen: true,
              showedMsg: 'user.invitations.sent.' + _response.reason,
              email:''
          });
      break;
      case 'codeFrom':
        _response.status === 'successfull'
        ? this.settedCode()
        : this.setState({
              isOpen: true,
              showedMsg: 'user.invitations.setted.' + _response.reason
          });
      break;
      case 'codeNotShowed':
        _response.status === 'successfull'
        ? this.settedCodeNotShowed()
        : this.setState({
              isOpen: true,
              showedMsg: 'user.invitations.setted.' + _response.reason
          });
      break;
      default:
      break;
    }
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
   //, ( p.status === 1 && Utils.timeElapsed(p.activationDate, 30 ) <= 30 ) ? this.codeInvElapsed('codeFrom', index, p.code, p.codeActivation ) : null 
  render() {
    return (
      <invitations>
        <div>
          <div class="row">
            <div class="col-xs-12">
              <div className="inv_intro">
                Enter code to activate invitation
                <form >
                  <div>
                    <div><input type="text" id="codeNotShowed" placeholder={this.translate('intro.code')}  onChange={(value) => this.handleChange(value) } value={this.state.codeNotShowed} /></div>
                    <div type='codeNotShowed' className='code_nonActive' onClick={this.handleSubmit} >{this.translate('user.codeNonSent')} <div className="right">►</div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-6">
              <div>Invitation codes list Codes From</div>
              {
                this.state.codesFrom.map((p, index) => (
                    <div className="inv_item" >
                      <div>{p.id}</div>
                      <div>{p.date}</div>
                      <div>{p.code}</div>
                      <div>{p.status}</div>
                      <div>{p.deferred}</div>
                      <div className={ p.status === 2 || p.status === 0 ? 'hide':'' } >{ p.activationDate ? this.translate('areLeft') +':'+ Utils.timeElapsed(p.activationDate, 30 ) +' '+this.translate('days') : '' }</div>   
                      <div type='codeFrom' index={index} code={p.code} className={ !p.status ? 'code_nonActive':'hide'} onClick={this.handleSubmit} ><div className="left pointerEventsDisable" >{this.translate('user.codeNonActive')}</div><div className="right pointerEventsDisable" >►</div></div>
                      <div className={ p.status === 1 ? 'code_active':'hide'} >{this.translate('user.codeActive')}</div>
                      <div className={ p.status === 2 ? 'code_lapsed':'hide'} >{this.translate('user.codeLapsed')}</div>
                    </div>
                ))
              }
            </div>
            <div class="col-xs-6">
              <div>Invitation codes list Codes To</div>
              {
                this.state.codesTo.map((p, index) => (
                    <div className="inv_item" >
                      <div>{p.id}</div>
                      <div>{p.date}</div>
                      <div>{p.code}</div>
                      <div>{p.status}</div>
                      <div>{p.deferred}</div>
                      <div elem={index} className={ p.status === 1 ? 'code_active':'hide'} >{this.translate('user.codeSent')}</div>
                      <form >
                        <div className={ !p.status ? 'code_noSended':'hide'} >
                          <div><input type="text" id="email" placeholder={this.translate('intro.email')}  onChange={(value) => this.handleChange(value) } value={this.state.email} /></div>
                          <div type='codeTo' index={index} onClick={this.handleSubmit} >{this.translate('user.codeNonSent')} <div className="right">►</div>
                          </div>
                        </div>
                      </form>
                      <div elem={index} className={ p.status === 2 ? 'code_lapsed':'hide'} >{this.translate('user.codeLapsed')}</div>
                    </div>
                ))
              }
            </div>
            
          </div>
        </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          { this.translate(this.state.showedMsg) + ( this.state.type === 'codeTo' ? this.state.email : '' ) }
        </Modal>
      </invitations> 
    );
  }
}

Invitations.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Invitations);
export default Invitations;