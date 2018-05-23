import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import { Modal, API } from '../../services/Rest.js'

class PersonalData extends React.Component {
  constructor(props) {
    super(props);
    var client = JSON.parse(localStorage.getItem('client')).personalData;
    this.state = {
      'isOpen': localStorage.getItem('proccess') === 'subscribing' ? true : false,
      'showedMsg': localStorage.getItem('proccess') === 'subscribing' ? 'register.subscription.basic' : null ,
      'name':client.name,
      'surname':client.surname,
      'email':client.email,
      'nickName':client.nickName
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      case 'pwd':
          this.state.pwd !== this.state.pwdRepit
          ? this.setState({
            'passwordNotMatch':this.translate('register.passwordNotMatch'),
            'pwdClass':'notValid_input'
          })
          : this.setState({
            'passwordNotMatch':'',
            'pwdClass':''
          })
      case 'pwdRepit':
          this.state.pwd !== this.state.pwdRepit
          ? this.setState({
            'passwordNotMatch':this.translate('register.passwordNotMatch'),
            'pwdClass':'notValid_input'
          })
          : this.setState({
            'passwordNotMatch':'',
            'pwdClass':''
          })
      default:
      break
    }
  }
  handleSubmit(event) {
    window.setSpinner();
    this.setState(() => ({
        showedMsg: ''
      }))
    event.preventDefault();
    API.action('savePersonalData', this.state, this.onSuccess, this.onError);
  }
  onSuccess = (_response) => {
    _response.status === 'successfull'
    ? ( 
      this.setState({
          'isOpen': true,
          'showedMsg': 'user.form.successful',
      })
    )
    : this.setState({
          isOpen: true,
          showedMsg: 'user.form.' + _response.reason
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
  componentDidMount() {
    localStorage.getItem('proccess') === 'subscribing'
    ? localStorage.removeItem('proccess')
    : null;
  }
  render() {
    return (
      <personalData>
        <div className="container" >
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div class="col-xs-12 col-md-6">
                <div><label>{this.translate('user.nick').toUpperCase()}</label></div>
                <div><input id="nickName" type="text" value={this.state.nickName} onChange={(value) => this.handleChange(value) } /></div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div><label>{this.translate('user.email').toUpperCase()}</label></div>
                <div><input id="email" type="text"  value={this.state.email} onChange={(value) => this.handleChange(value) } /></div>
              </div>
            </div>
            <div className="row">
              <div class="col-xs-12 col-md-6">
                <div><label>{this.translate('user.name').toUpperCase()}</label></div>
                <div><input id="name" type="text"  value={this.state.name} onChange={(value) => this.handleChange(value) } /></div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div><label>{this.translate('user.surname').toUpperCase()}</label></div>
                <div><input id="surname" type="text" value={this.state.surname} onChange={(value) => this.handleChange(value) } /></div>
              </div>
            </div>
            <div><div className="submitBtn" onClick={this.handleSubmit} >{this.translate('save').toUpperCase()}</div></div>
          </form>
        </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </personalData> 
    );
  }
}

PersonalData.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(PersonalData);
export default PersonalData;