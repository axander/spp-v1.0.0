import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import { Link } from 'react-router-dom'
import Utils from '../../utils/Utils.js'
import { Modal, API } from '../../services/Rest.js'


class RecoverConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'newPwd':'',
     'passwordNotMatch':'',
     'pwdClass':'',
     'newPwdRepit':'',
     'deactive': 'disabled',
     'isOpen': false,
     'recovered':false,
     'invalidData':false,
     'urlParams': {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    switch(event.target.id){
      case 'newPwd':
          this.setState({[event.target.id]:event.target.value});
          this.state.newPwd !== this.state.newPwdRepit
          ? this.setState({
            'passwordNotMatch':this.translate('register.passwordNotMatch'),
            'pwdClass':'notValid_input'
          })
          : this.setState({
            'passwordNotMatch':'',
            'pwdClass':''
          })
      break;
      case 'newPwdRepit':
          this.setState({[event.target.id]:event.target.value});
          this.state.newPwd !== this.state.newPwdRepit
          ? this.setState({
            'passwordNotMatch':this.translate('register.passwordNotMatch'),
            'pwdClass':'notValid_input'
          })
          : this.setState({
            'passwordNotMatch':'',
            'pwdClass':''
          })
      break;
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.setState({[event.target.id]:event.target.value});
    this.state.newPwd !== '' && this.state.newPwdRepit !== '' && this.state.passwordNotMatch === ''
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    window.setSpinner();
    this.state.urlParams.newPwd = this.state.newPwd,
    API.action('confirmRecoverPassword', this.state.urlParams, this.onSuccess, this.onError)
  }
  componentDidMount() {
    var urlParameters = [];
    typeof window.location.href.split('?')[1] !== 'undefined'
    ? ( urlParameters = window.location.href.split('?')[1].split('&'),
        this.setParameters(urlParameters),
        window.history.replaceState({}, document.title, "./#/recover/confirm")
      )
    : this.setState(() => ({
          'isOpen': true,
          'invalidData':true,
          'showedMsg': 'confirm.0003'
        }));
    
  }
  setParameters(_urlParameters){
    for( var j in _urlParameters){
          var param = _urlParameters[j].split('=');
          this.state[param[0]] = param[1];
          this.state.urlParams[param[0]]= param[1];
        }
  }
  onSuccess = (_response) => {
    _response.status === 'successfull'
    ? this.setState({
          'recovered':true,
          'invalidData' : false,
          'isOpen': true,
          'showedMsg': 'register.recoverPwd.confirm.successfull'
      })
    : this.setState({
          'isOpen': true,
          'showedMsg': 'register.recoverPwd.confirm.' + _response.reason
      });
    
  }
  onError = (_response, _error) =>{
    this.setState({
          'isOpen': true,
          'showedMsg': _error
      });
  }
  toggleModal = () => {
      this.setState({
          'isOpen': !this.state.isOpen
      });
   }
  render() {
    return (
      <auth>

        <div className="basicOuter" >
      	  	<div className="basicInner">
              <div>
        	    	<h1 className={ this.state.recovered ? 'hide' : '' } >{this.translate('register.recoverPwd.rot')}</h1>
                <h1 className={ !this.state.recovered ? 'hide' : '' } >{this.translate('register.recoveredPwd.rot')}</h1>
                <form onSubmit={this.handleSubmit} className={ this.state.recovered || this.state.invalidData ? 'hide' : '' } >
                  <div><label>{this.translate('newPassword').toUpperCase()}</label></div>
                  <div><input id="newPwd" type="password" onChange={this.handleChange} className={ this.state.pwdClass } value={this.state.newPwd} /></div>
                  <div className="notValid_msg" >{this.state.passwordNotMatch}</div>
                  <div><label>{this.translate('newPassword.repit').toUpperCase()}</label></div>
                  <div><input id="newPwdRepit" type="password" onChange={this.handleChange} className={ this.state.pwdClass } value={this.state.newPwdRepit} /></div>
                  <div><div  className={"submitBtn " + this.state.deactive } onClick={this.handleSubmit} >{this.translate('continue').toUpperCase()}</div></div>
                </form>
                <Link to='/login' className={ this.state.recovered ? 'hide' : '' }><div className="backPB" >{this.translate('back')}</div></Link>
                <Link to='/login' className={ !this.state.recovered ? 'hide' : '' } ><div className="backPB" >{this.translate('login')}</div></Link>
              </div>
      		</div>
    	  </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </auth>  
    );
  }
}

RecoverConfirm.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(RecoverConfirm);
export default RecoverConfirm;