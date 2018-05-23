import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js';
import { Modal, API } from '../../../services/Rest.js'
import './PaymentPremium.scss'

class PaymentPremium extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'card':false,
     'paypal':true,
     'emailPaypalValidation':false,
     'initPaypalMailValidation':false,
     'paypalMail':'',
     'cardNumber':'',
     'month':'',
     'year':'',
     'cvv':'',
     'code':'',
     'deactive': 'disabled',
    };
    this.handleChange = this.handleChange.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.handleSubmitPayment = this.handleSubmitPayment.bind(this);
  }
  clickHandler(_type){
    switch(_type){
      case 'card':
        this.setState({
          'card':true,
          'paypal':false
        })
      break;
      case 'paypal':
        this.setState({
          'card':false,
          'paypal':true
        })
      break;
      default:
      break;
    }
    this.validate();
  }
  onSuccess = (_response) => {
    var clientData ;
    _response.status === 'success'
    ? (
        clientData = JSON.parse(localStorage.getItem('client')),
        clientData.personalData.type = 'premium',
        localStorage.setItem('client',JSON.stringify(clientData)),
        localStorage.setItem('toPremium',true),
        this.setState({
          'isOpen':true,
          'showedMsg': 'user.updated'
        })
      )
    : this.setState({
          isOpen: true,
          showedMsg: 'register.' + _response.reason
      });
  }
  onError = (_response, _error) =>{
    var clientData = JSON.parse(localStorage.getItem('client'));
    clientData.personalData.type = 'premium';
    localStorage.setItem('client',JSON.stringify(clientData));
    localStorage.setItem('toPremium',true);
    this.setState({
      'isOpen':true,
      'showedMsg': 'user.updated'
    })
    /*this.setState({
          isOpen: true,
          showedMsg: _error
      });*/
  } 
  reloadPremium(){
    window.location.reload()
  }
  toggleModal = () => {
    localStorage.getItem('toPremium')
    ? (
        localStorage.removeItem('toPremium'),
        window.location.href = '#/',
        this.reloadPremium()
      )
    : this.setState({
        isOpen: !this.state.isOpen
      });
  }
  handleSubmitPayment() {
    window.setSpinner();
    this.state.paypal
    ? API.action('savePremiumPaypal', { 'email': this.state.paypalMail } , this.onSuccess, this.onError, 'GET', false, true)
    : API.action('savePremiumCard', {} , this.onSuccess, this.onError, 'GET', false, true)
  }
  handleChange(event) {
    switch(event.target.id){
      case 'paypalMail':
          this.setState({
            [event.target.id]:event.target.value,
            'initPaypalMailValidation':true
          });
          !Utils.validateEmail(event.target.value)
          ? this.setState({
            'emailPaypalValidation':false
          })
          : this.setState({
            'emailPaypalValidation':'true'
          })
      break;
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.validate();
  }
  validate(){

    this.state.paypal && this.state.emailPaypalValidation
    ? this.state.paypalMail !== ''
      ? this.state.deactive = ''
      :this.state.deactive = 'disabled'
    : this.state.card && this.state.cardNumber !== '' && this.state.month !== '' && this.state.year !== '' && this.state.cvv !== '' 
      ? this.state.deactive = ''
      : this.state.deactive = 'disabled';
    
  }

  render() {
    return (
      <div style={this.state.style} >
        <payment>
          <div class='mt50 mb50 paymentPremium'>
          	    	{/*<h1>{this.translate('create.account')}</h1>*/}
                  <form autocomplete="on" >
                    <div className="payment_register_type payment_input_50_2"  onClick={() => this.clickHandler('paypal')}>
                      <div className="payment_register_item_selector" >
                        <div className={ this.state.paypal ? "payment_register_item_selector_selected" : "hide"} ></div>
                      </div>
                      <div className ="payment_register_item_rot">{this.translate('paypal')}</div>
                    </div>
                    {/*<div className="payment_register_type payment_input_50_1"  onClick={() => this.clickHandler('card')}>
                      <div className="payment_register_item_selector" >
                        <div className={ this.state.card ? "payment_register_item_selector_selected" : "hide"} ></div>
                      </div>
                      <div className ="payment_register_item_rot">{this.translate('creditCard')}</div>
                    </div>*/}
                    <div className={ this.state.paypal ? 'hide' : 'hide' } >
                      <div><input id="cardNumber" type="text"  onChange={this.handleChange} value={this.state.cardNumber} placeholder={this.translate('cardNumber')} /></div>
                      <div className="payment_input_50_1" ><input id="month" type="text"  onChange={this.handleChange} value={this.state.month} placeholder={this.translate('month')} /></div>
                      <div className="payment_input_50_2" ><input id="year" type="text"  onChange={this.handleChange} value={this.state.year} placeholder={this.translate('year')} /></div>
                      <div className="payment_input_50_1"><input id="cvv" type="text"  onChange={this.handleChange} className={ this.state.cvv} value={this.state.cvv} placeholder={this.translate('cvv')} /></div>
                      <div className="payment_input_50_1">{this.translate('what')}</div>
                    </div>
                    <div className={ this.state.paypal ? '' : 'hide' } >
                      {/*<div><input id="paypalMail" className={this.state.initPaypalMailValidation && !this.state.emailPaypalValidation ? 'notValid_input':''} type="text"  onChange={this.handleChange} value={this.state.paypalMail} placeholder={this.translate('user.paypalMail')} /></div>
                      <div className={ this.state.initPaypalMailValidation && !this.state.emailPaypalValidation ? 'notValid_msg'  : 'hide'} >{this.translate('paypalMailNotValid')}</div>*/}
                      <div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                          <input type="hidden" name="cmd" value="_s-xclick" />
                          <input type="hidden" name="hosted_button_id" value="24YQWNE8M4D9S" />
                          <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_subscribe_LG.gif" border="0" name="submit" alt="PayPal, la forma rápida y segura de pagar en Internet." />
                          <img alt="" border="0" src="https://www.paypalobjects.com/es_ES/i/scr/pixel.gif" width="1" height="1" />
                        </form>
                      </div>
                    </div>
                    {/*<div className="mt50 right payment_finalize" ><div className={"greenPB " + this.state.deactive } onClick={this.handleSubmitPayment } >{this.translate('save')}</div></div>*/}
                  </form>
          </div>
        </payment>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div>  
    );
  }
}
PaymentPremium.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(PaymentPremium);
export default PaymentPremium;