import React from 'react'
import ReactDOM from 'react-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Basic from '../../components/Subscription/Basic.js'
import Invited from '../../components/Subscription/Invited.js'
import Premium from '../../components/Subscription/Premium.js'
import { Modal, API } from '../../services/Rest.js'


class Subscription extends React.Component {
  constructor(props) {
    super(props);
    var client = JSON.parse(localStorage.getItem('client'));
    this.state={
      'list':client.paymentData.subscription,
      'type':client.paymentData.subscription.type.premium.status === 1 ? 'premium' : client.paymentData.subscription.type.invited.status === 1 ? 'invited' : 'basic',
      'isOpen': localStorage.getItem('proccess') ? true : false ,
      'showedMsg': localStorage.getItem('proccess') ? localStorage.getItem('proccess') : '',
      'code': client.paymentData.subscription.type.invited.code,
      'activationDateInv': client.paymentData.subscription.type.invited.activationDate,
    }
  }
  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  componentDidMount() {
    var client = JSON.parse(localStorage.getItem('client'));
    localStorage.getItem('proccess') ? localStorage.removeItem('proccess') : null;
    localStorage.getItem('checkingSubscription') ? localStorage.removeItem('checkingSubscription') : null;
  }
  render() {
    return (
      <subscription>
        <div className="basicOuter" >
          <div className="basicInner">
            <div>
              {this.translate('user.actualSubscription')}
            </div>
            <div className="subs_actual" >
              {this.translate('user.'+ this.state.type)}
            </div>
            <div>
              {this.translate('user.allSubscription')}
            </div>
            <div className="row" >
              <div className="col-xs-12 col-md-4" >
                <Basic data={this.state.list.type.basic} />
              </div>
              <div className="col-xs-12 col-md-4" >
                <Invited data={this.state.list.type.invited} />
              </div>
              <div className="col-xs-12 col-md-4" >
                <Premium data={this.state.list.type.premium} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Modal show={this.state.isOpen} onClose={this.toggleModal} >
            {this.translate(this.state.showedMsg)}
          </Modal>
        </div>
      </subscription>  
    );
  }
}

Subscription.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Subscription);
export default Subscription;