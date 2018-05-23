import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import { Link } from 'react-router-dom'
import { Modal, API } from '../../services/Rest.js'
import Basic from '../../components/Subscription/Basic.js'
import Invited from '../../components/Subscription/Invited.js'
import Premium from '../../components/Subscription/Premium.js'


class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'activation_code':this.props.match.params.code,
     'showedMsg': localStorage.getItem('error'),
     'isOpen': localStorage.getItem('error') ? true : false,
     'loggedAs': localStorage.getItem('logged') ? 'basicBorderBtn inline' : 'hide',
     'subscription': localStorage.getItem('logged') ? '' : 'hide',
     'notLogged': localStorage.getItem('logged') ? 'hide' : 'contrast basicBorderBtn inline',
     'nickName': JSON.parse(localStorage.getItem('client')) ? JSON.parse(localStorage.getItem('client')).personalData.nickName : null,
     'msg':!localStorage.getItem('logged') ? this.translate('confirm.wait') : this.translate('confirm.successful')
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    typeof this.state.activation_code !== 'undefined' && this.state.activation_code.length
    ? ( 
        window.history.replaceState({}, document.title, "./#/confirm"),
        API.action('confirmAccount', {'activation_code':this.state.activation_code}, this.onSuccess, this.onError, 'GET', false, true)
      )
    : window.location.href = './#/explorar'
  }
  setParameters(_urlParameters){
    for( var j in _urlParameters){
          var param = _urlParameters[j].split('=');
          this.state[param[0]] = param[1];
        }
  }
  componentDidUpdate(){
    /*localStorage.getItem('error')
    ? ( this.setState({
          isOpen: true,
          showedMsg: localStorage.getItem('error')
      }) , localStorage.removeItem('error') )
    :null;*/
  }
  onSuccess = (_response) => {
    _response.status === 'success'
    ? ( 
      localStorage.setItem('confirmed',true),
      window.location.href='#/'
    )
    : ( 
      this.setState({
          isOpen: true,
          showedMsg: 'confirm.' + _response.reason
      }),
      localStorage.setItem('modalToExplore','explorar')
    )
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
  handleChange(event) {
    console.log(event.target.id);
    this.setState({[event.target.id]:event.target.value});
  }
  handleSubmit(event) {
    
  }


  render() {
    return (
      <confirm>
        <div className="basicOuter" >
    	  	<div className="basicInner">
            <div>{this.state.msg}</div>
            <Link to='/' className="contrast" ><div  className={this.state.notLogged} >{this.translate('back')}</div></Link>
            <Link to='/user' className='contrast'><div className={this.state.loggedAs}>{this.translate('logged.as')}{this.state.nickName}</div></Link>
            <div className={this.state.subscription} >
              <div className="row" >
                <div className="col-xs-12 col-md-4" >
                  <Basic data={ {'status': 1, activationDate:new Date().getTime()} } />
                </div>
                <div className="col-xs-12 col-md-4" >
                  <Invited data={ {'status': 0, 'code':''} }/>
                </div>
                <div className="col-xs-12 col-md-4" >
                  <Premium data={ {'status': 0} }/>
                </div>
              </div>
            </div>
    		  </div>
    	  </div>
        <Modal show={this.state.isOpen} onClose={this.toggleModal} >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </confirm>  
    );
  }
}

Confirm.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Confirm);
export default Confirm;