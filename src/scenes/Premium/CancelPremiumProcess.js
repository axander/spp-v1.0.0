import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import './premium.scss'

class CancelPremiumProcess extends React.Component {
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
        <h1>{this.translate('user.toPremiumCanceled')}</h1>
        <div className="cancelPremiumMsg" >
          {this.translate('user.toPremiumCancel')}
        </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal}  >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div>
    );
  }
}

CancelPremiumProcess.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(CancelPremiumProcess);
export default CancelPremiumProcess;