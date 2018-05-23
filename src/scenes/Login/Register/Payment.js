import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js';
import './Payment.scss'

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'card':false,
     'paypal':false,
     'cardNumber':'',
     'month':'',
     'year':'',
     'cvv':'',
     'code':'',
     'deactive': 'disabled',
    };
    this.handleChange = this.handleChange.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
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
  handleChange(event) {
    switch(event.target.id){
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.validate();
  }
  validate(){
    ( this.state.card || this.state.paypal ) && this.state.cardNumber !== '' && this.state.month !== '' && this.state.year !== '' && this.state.cvv !== '' 
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
  }

  render() {
    return (
      <div style={this.state.style} >
        <payment>
          <div class='mt50 mb50 payment'>
          	    	{/*<h1>{this.translate('create.account')}</h1>*/}
                  <form onSubmit={this.handleSubmit} autocomplete="on" >
                    <div className="payment_register_type payment_input_50_1"  onClick={() => this.clickHandler('card')}>
                      <div className="payment_register_item_selector" >
                        <div className={ this.state.card ? "payment_register_item_selector_selected" : "hide"} ></div>
                      </div>
                      <div className ="payment_register_item_rot">{this.translate('creditCard')}</div>
                    </div>
                    <div className="payment_register_type payment_input_50_2"  onClick={() => this.clickHandler('paypal')}>
                      <div className="payment_register_item_selector" >
                        <div className={ this.state.paypal ? "payment_register_item_selector_selected" : "hide"} ></div>
                      </div>
                      <div className ="payment_register_item_rot">{this.translate('paypal')}</div>
                    </div>
                    <div><input id="cardNumber" type="text"  onChange={this.handleChange} value={this.state.cardNumber} placeholder={this.translate('cardNumber')} /></div>
                    <div className="payment_input_50_1" ><input id="month" type="text"  onChange={this.handleChange} value={this.state.month} placeholder={this.translate('month')} /></div>
                    <div className="payment_input_50_2" ><input id="year" type="text"  onChange={this.handleChange} value={this.state.year} placeholder={this.translate('year')} /></div>
                    <div className="payment_input_50_1"><input id="cvv" type="text"  onChange={this.handleChange} className={ this.state.cvv} value={this.state.cvv} placeholder={this.translate('cvv')} /></div>
                    <div className="payment_input_50_1">{this.translate('what')}</div>
                    <div className="mb25 mt25 left">{this.translate('haveCode')}</div>
                    <div><input id="code" type="password" onChange={this.handleChange} className={ this.state.code } value={this.state.code} placeholder={this.translate('code')}/></div>
                    <div className="mt50 right payment_finalize" ><div className={"greenPB " + this.state.deactive } onClick={() => this.props.flow(this.state,'payment')} >{this.translate('register.finalize')}</div></div>
                    <div className="mt50 left payment_cancel" ><div className="neutralPB" onClick={() => this.props.back('data')} >{this.translate('register.cancel')}</div></div>
                  </form>
          </div>
        </payment>
      </div>  
    );
  }
}
Payment.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Payment);
export default Payment;