import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import PaymentPremium from '../Login/Register/PaymentPremium.js'
import './premium.scss'

class Premium extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'data':[ ]
    }
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount(){
    localStorage.removeItem('goPremium');
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
  }
  componentWillUpdate(){
    this.props.auth.isAuthenticated
    ? this.props.auth.typeUser !== 'premium'
      ? window.location.href = './#/premium'
      : window.location.href = './#/subscription'
    : window.location.href = './#/register';
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
        <h1>{this.translate('user.toPremium')}</h1>
        <PaymentPremium flow={this.flow} back={this.tabSelected} />
        <Modal show={this.state.isOpen} onClose={this.toggleModal}  >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div>
    );
  }
}

Premium.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Premium);
export default Premium;