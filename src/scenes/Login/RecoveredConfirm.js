import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import { Link } from 'react-router-dom'
import Utils from '../../utils/Utils.js'
import { Modal, API } from '../../services/Rest.js'
import './recoveredConfirm.scss'

class RecoveredConfirm extends React.Component {
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
     'urlParams': {},
     'code':this.props.match.params.code
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  handleChange(event) {
    switch(event.target.id){
      case 'newPwd':
          this.setState({[event.target.id]:event.target.value});
          this.state.newPwd.length < 8
          ? this.setState({
            'passwordLength':this.translate('register.passwordLength'),
            'pwdClass':'notValid_input',
            'length':false
          })
          : this.setState({
            'passwordLength':'',
            'pwdClass':'',
            'length':true
          })
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
    event.preventDefault();
    window.setSpinner();
    API.action('confirmRecoverPassword', { 'activation_code':this.state.code, 'password':this.state.newPwd }, this.onSuccess, this.onError, 'GET', true, false)
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    typeof this.state.code !== 'undefined' && this.state.code.length
    ? ( 
        window.history.replaceState({}, document.title, "./#/recovered/confirm")
        /*API.action('confirmAccount', {'activation_code':code}, this.onSuccess, this.onError, 'GET', false, true)*/
      )
    : window.location.href = './#/explorar'

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
  onSuccess = (_response) => {
    _response.status === 'success'
    ? ( 
      this.setState({
          'recovered':true,
          'invalidData' : false,
          'isOpen': true,
          'showedMsg': 'register.recoverPwd.confirm.successfull'
      }),
      localStorage.setItem('modalToExplore',localStorage.getItem('lastState').substring(1))
    )
    : (
      this.setState({
          'isOpen': true,
          'showedMsg': 'register.recoverPwd.confirm.' + _response.reason
      }),
      localStorage.setItem('modalToExplore','explorar')
    )
    
  }
  onError = (_response, _error) =>{
    this.setState({
          'isOpen': true,
          'showedMsg': _error
      });
    localStorage.setItem('modalToExplore','explorar')
  }
  toggleModal = () => {
      this.setState({
          'isOpen': !this.state.isOpen
      });
   }
  render() {
    return (
      <div className="recoveredConfirm" style={this.state.style} >
        <div className="basicOuter" >
      	  	<div className="basicInner">
              <div>
        	    	<h1 className={ this.state.recovered ? 'hide' : '' } >{this.translate('register.recoverPwd.rot')}</h1>
                <h1 className={ !this.state.recovered ? 'hide' : '' } >{this.translate('register.recoveredPwd.rot')}</h1>
                <form onSubmit={this.handleSubmit} className={ this.state.recovered || this.state.invalidData ? 'hide' : '' } >
                  <div><label>{this.translate('newPassword').toUpperCase()}</label></div>
                  <div><input id="newPwd" type="password" onChange={this.handleChange} className={ this.state.pwdClass } value={this.state.newPwd} /></div>
                  <div className="notValid_msg" >{this.state.passwordNotMatch}</div>
                  <div className="notValid_msg" >{this.state.passwordLength}</div>
                  <div><label>{this.translate('newPassword.repit').toUpperCase()}</label></div>
                  <div><input id="newPwdRepit" type="password" onChange={this.handleChange} className={ this.state.pwdClass } value={this.state.newPwdRepit} /></div>
                </form>
                <div className="recoveredConfirm_buttons mb50" >
                  <Link to='/login' className={ this.state.recovered ? 'hide' : '' }><div className="cancelPB" >{this.translate('register.cancel').toUpperCase()}</div></Link>
                  <div><div  className={"continuePB " + this.state.deactive } onClick={this.handleSubmit} >{this.translate('continue').toUpperCase()}</div></div>
                </div>
              </div>
      		</div>
    	  </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div>  
    );
  }
}

RecoveredConfirm.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(RecoveredConfirm);
export default RecoveredConfirm;