import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import { Link } from 'react-router-dom'
import Utils from '../../utils/Utils.js'
import { Modal, API } from '../../services/Rest.js'


class Recover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'email':'',
     'emailClass':'',
     'emailValidation':'',
     'deactive': 'disabled',
     'sended':false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.setState({[event.target.id]:event.target.value});
    this.state.email !== '' && this.state.emailValidation === ''
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    window.setSpinner();
    API.action('recoverPassword', { 'email': this.state.email }, this.onSuccess, this.onError);
  }
  onSuccess = (_response) => {
    _response.status === 'successfull'
    ? this.setState({
          'recovered':true,
          'invalidData' : false,
          'isOpen': true,
          'showedMsg': 'register.recoverPwd.successfull',
          'sended': true
      })
    : this.setState({
          'isOpen': true,
          'showedMsg': 'register.recoverPwd.' + _response.reason
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
  componentDidMount() {
    
  }
  componentWillUnmount(){
    Utils.scrollToTop(300);
  }

  render() {
    return (
      <div className='mainContainer' >
        <recover>
          <div className='recover'>
              <div className="basicOuter" >
            	  	<div className="basicInner">
            	    	<h1 className={ this.state.sended ? 'hide':''} >{this.translate('register.recoverPwd.rot')}</h1>
                    <h1 className={ !this.state.sended ? 'hide':''} >{this.translate('register.recoverPwd.sended.rot')}</h1>
                    <form className={this.state.sended ? 'hide':''}  onSubmit={this.handleSubmit}>
                      <div><label>{this.translate('email').toUpperCase()}</label></div>
                      <div><input id="email" type="text"  onChange={this.handleChange} className={ this.state.emailClass} value={this.state.email} /></div>
                      <div className="notValid_msg" >{this.state.emailValidation}</div>
                      <div><div  className={"submitBtn " + this.state.deactive } onClick={this.handleSubmit} >{this.translate('continue').toUpperCase()}</div></div>
                    </form>
                    <Link to='/login'><div className="backPB" >{this.translate('back')}</div></Link>
            		</div>
          	  </div>
              <Modal show={this.state.isOpen} onClose={this.toggleModal} >
                {this.translate(this.state.showedMsg)}
              </Modal>
            </div>
        </recover>  
      </div>
    );
  }
}

Recover.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Recover);
export default Recover;