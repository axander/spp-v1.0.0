import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js';
import { Link } from 'react-router-dom'
import './Intro.scss'

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'email':'',
     'emailClass':'',
     'emailValidation':'',
     'nickName':'',
     'nickNameValidation':'',
     'nickNameValidationInit':false,
     'name':'',
     'surname':'',
     'pwd':'',
     'passwordNotMatch':'',
     'pwdClass':'',
     'pwdRepit':'',
     'terms':false,
     'deactive': 'disabled',
     'oneStep':true
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidUpdate() {
    // Will execute as normal
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
          this.setState({[event.target.id]:event.target.value});
          this.state.pwd.length < 8
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
          this.state.pwd !== this.state.pwdRepit
          ? this.setState({
            'passwordNotMatch':this.translate('register.passwordNotMatch'),
            'pwdClass':'notValid_input'
          })
          : this.setState({
            'passwordNotMatch':'',
            'pwdClass': !this.state.length ? 'notValid_input' : ''
          })
      break;
      case 'pwdRepit':
          this.setState({[event.target.id]:event.target.value});
          this.state.pwd !== this.state.pwdRepit
          ? this.setState({
            'passwordNotMatch':this.translate('register.passwordNotMatch'),
            'pwdClass':'notValid_input'
          })
          : this.setState({
            'passwordNotMatch':'',
            'pwdClass':!this.state.length ? 'notValid_input' : ''
          })
      break;
      case 'nickName':
          event.target.value.length >= 4 && event.target.value.length<=20
          ? this.setState({
              [event.target.id]:event.target.value,
              'nickNameValidation':true,
              'nickNameValidationInit':true
            })
          : this.setState({
              [event.target.id]:event.target.value,
              'nickNameValidation':false,
              'nickNameValidationInit':true
            })
      break;
      case 'name':
          this.setState({[event.target.id]:event.target.value});
      break;
      case 'surname':
          this.setState({[event.target.id]:event.target.value});
      break;
      case 'terms':
          this.setState({[event.target.id]:event.target.checked});
          this.setState({
            'terms':event.target.checked
          })
      break;
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.state.email !== '' && this.state.length && this.state.pwd !== '' && this.state.pwdRepit !== '' && this.state.nickName !== '' && this.state.nickNameValidation && this.state.name !== '' && this.state.surname !== ''
    && this.state.emailValidation === '' && this.state.passwordNotMatch === '' && this.state.terms
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
    
  }
 
  render() {
    return (
      <div style={this.state.style} >
        <register>
          <div class='mt50 mb50 intro'>
          	    	{/*<h1>{this.translate('create.account')}</h1>*/}
                  <form onSubmit={this.handleSubmit} autocomplete="on" >
                    <div><input id="nickName" className={ this.state.nickNameValidationInit && ( this.state.nickName === '' || !this.state.nickNameValidation ) ? 'notValid_input' : ''} type="text"  onChange={this.handleChange} value={this.state.nickName} placeholder={this.translate('user')} /></div>
                    <div className={ this.state.nickNameValidationInit && ( this.state.nickName === '' || !this.state.nickNameValidation ) ? 'notValid_msg' : 'hide'}  >{this.translate('user.nickNameNotValid')}</div>
                    <div><input id="name" type="text"  onChange={this.handleChange} value={this.state.name} placeholder={this.translate('name')} /></div>
                    <div><input id="surname" type="text"  onChange={this.handleChange} value={this.state.surname} placeholder={this.translate('surname')} /></div>
                    <div><input id="email" type="text"  onChange={this.handleChange} className={ this.state.emailClass} value={this.state.email} placeholder={this.translate('email')} /></div>
                    <div className="notValid_msg" >{this.state.emailValidation}</div>
                    <div><input id="pwd" type="password" onChange={this.handleChange} className={ this.state.pwdClass } value={this.state.pwd} placeholder={this.translate('password')}/></div>
                    <div className="notValid_msg" >{this.state.passwordLength}</div>
                    <div className="notValid_msg" >{this.state.passwordNotMatch}</div>
                    <div><input id="pwdRepit" type="password" onChange={this.handleChange} className={ this.state.pwdClass } value={this.state.pwdRepit} placeholder={this.translate('password.repit')} /></div>
                    <div className="mt25 left intro_accept" ><input id="terms" type="checkbox" onChange={this.handleChange}  checked={this.state.terms}  />{this.translate('user.accept')}<Link className='aTerms' to='/info/legal' target="_blank" > {this.translate('user.terms')}</Link>.</div>
                    <div className="mt50 right intro_continue" ><div className={"greenPB " + this.state.deactive }  onClick={() => this.props.flow(this.state,'intro')} >{this.state.oneStep ? this.translate('register.finalize') : this.translate('register.continue')}</div></div>
                  </form>
          </div>
        </register>
      </div>  
    );
  }
}
Intro.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Intro);
export default Intro;