import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js';
import { Modal, API } from '../../../services/Rest.js'
import './promotionalCode.scss'

class PromotionalCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'codeValidation':false,
     'initCodeValidation':false,
     'code':'',
     'deactive': 'disabled',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitPayment = this.handleSubmitPayment.bind(this);
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
          'showedMsg': 'user.updatedPromotional'
        })
        /*window.location.href = '#/',
        this.reloadPremium()*/
      )
    : this.setState({
          isOpen: true,
          showedMsg: 'register.' + _response.reason
      });
  }
  onError = (_response, _error) =>{
    /*var clientData = JSON.parse(localStorage.getItem('client'));
    clientData.personalData.type = 'premium';
    localStorage.setItem('client',JSON.stringify(clientData));
    localStorage.setItem('toPremium',true);
    this.setState({
      'isOpen':true,
      'showedMsg': 'user.updatedPromotional'
    })*/
    this.setState({
      isOpen: true,
      showedMsg: _error
    });
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
    API.action('savePromotional', { 'code': this.state.code } , this.onSuccess, this.onError, 'GET', false, true)
  }
  handleChange(event) {
    switch(event.target.id){
      case 'code':
          this.setState({
            [event.target.id]:event.target.value,
            'initCodeValidation':true
          });
          this.state.code.length <= 3
          ? this.setState({
              'codeValidation':false
            })
          : this.setState({
              'codeValidation':true
          })
      break;
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.validate();
  }
  validate(){
    this.state.code && this.state.code !== '' && this.state.codeValidation
      ? this.state.deactive = ''
      : this.state.deactive = 'disabled';
    
  }

  render() {
    return (
      <div style={this.state.style} >
        <payment>
          <div class='mt50 mb50 promotionalCode'>
                  <form autocomplete="on" >
                    <div className="mb25 mt25 left">{this.translate('code.description')}</div>
                    <div><input id="code" type="text" onChange={this.handleChange} className={this.state.initCodeValidation && !this.state.codeValidation ? 'notValid_input':''}   value={this.state.code} placeholder={this.translate('code')}/></div>
                    <div className={ this.state.initCodeValidation && !this.state.codeValidation ? 'notValid_msg'  : 'hide'} >{this.translate('code.notValid')}</div>
                    <div className="mt50 center payment_finalize" ><div className={"greenPB " + this.state.deactive } onClick={this.handleSubmitPayment } >{this.translate('validate')}</div></div>
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
PromotionalCode.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(PromotionalCode);
export default PromotionalCode;