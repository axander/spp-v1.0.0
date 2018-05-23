import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import './premium.scss'

class PremiumProccessOk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'success':false
    }
    this.handleResize = this.handleResize.bind(this);
  }
  onSuccess = (_response) => {
    Utils.scrollToTop(300);
    var clientData = JSON.parse(localStorage.getItem('client'))
    _response.status === 'success'
    ? ( 
      clientData.personalData.type = 'premium',
      localStorage.setItem('client', JSON.stringify(clientData)),
      this.props.auth.setUser('premium'),
      this.setState ({
        'success':true
      })
    )
    : this.setState({
        isOpen: true,
        showedMsg: 'profile.' + _response.reason
    });
  }
  onError = (_response, _error) =>{
    this.setState({
          isOpen: true,
          showedMsg: _error
      });
  }
  componentDidMount(){
    localStorage.removeItem('goPremium');
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    });
    var emailClient = JSON.parse(localStorage.getItem('client')).personalData.email;
    API.action('confirmPremium', { 'email': emailClient }, this.onSuccess, this.onError, 'GET', true, false);//,
  }
  componentWillUpdate(){
    /*this.props.auth.isAuthenticated
    ? this.props.auth.typeUser === 'premium'
      ? window.location.href = './#/subscription'
      : null
    : window.location.href = './#/register';*/
  }
  handleResize() {
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
      <div className='premium' style={this.state.style} >
        <h1>{this.translate('user.toPremiumOk')}</h1>
        <div className="okPremiumMsg" >
          {this.translate('user.toPremiumSuccess')}
        </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal}  >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div>
    );
  }
}

PremiumProccessOk.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(PremiumProccessOk);
export default PremiumProccessOk;