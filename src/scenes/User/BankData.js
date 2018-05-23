import React from 'react'
import { Link, Route } from 'react-router-dom'
import { Modal, API } from '../../services/Rest.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js';

class BankData extends React.Component {
  constructor(props) {
    super(props);
    var client = JSON.parse(localStorage.getItem('client')).personalData;
    this.state = {
      'isOpen': localStorage.getItem('proccess') === 'subscribing' ? true : false,
      'showedMsg': localStorage.getItem('proccess') === 'subscribing' ? 'register.subscription.premium' : null ,
    };
  }
  componentDidMount() {
    localStorage.getItem('proccess') === 'subscribing'
    ? localStorage.removeItem('proccess')
    : null;
  }
  toggleModal = () => {
    this.setState({
        isOpen: !this.state.isOpen
    });
   }
  render() {
    return (
      <bankData>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </bankData> 
    );
  }
}

BankData.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(BankData);
export default BankData;