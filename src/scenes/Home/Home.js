import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import { Modal, API } from '../../services/Rest.js';
import Utils from '../../utils/Utils.js';
import Podcast from '../Podcast/Podcast.js'
import Channel from '../Channel/Channel.js'
import Episode from '../Episode/Episode.js'

class Home extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem('lastState',props.location.pathname);
    this.state = {
      'toogle':true,
      'show': 'hideMenu',
      'loggedAs': localStorage.getItem('logged') ? 'basicBorderBtn inline' : 'hide',
      'notLogged': localStorage.getItem('logged') ? 'hide' : 'basicBorderBtn inline',
      'nickName': JSON.parse(localStorage.getItem('client')) ? JSON.parse(localStorage.getItem('client')).personalData.nickName : null
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(){
    this.props.auth.afterRequiredApp = null;
  }
  onSuccess = (_response) => {
    Utils.scrollToTop(300);
    _response.status === 'success'
    ? localStorage.setItem('static', JSON.stringify(_response.result))
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
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
  componentDidMount() {
    window.setSpinner();//,
    API.action('getStatic', null, this.onSuccess, this.onError, 'GET', false, true);
      
  }
  componentDidUpdate(){
    this.state = {
      'toogle':true,
      'show': 'hideMenu',
      'loggedAs': localStorage.getItem('logged') ? 'basicBorderBtn inline' : 'hide',
      'notLogged': localStorage.getItem('logged') ? 'hide' : 'basicBorderBtn inline',
      'nickName': JSON.parse(localStorage.getItem('client')) ? JSON.parse(localStorage.getItem('client')).personalData.nickName : null
    }
  }

  render() {
    return (
      <div className="home" >
        <div>
  	    	<h1>{this.translate('welcome')}</h1>
          <div>
            <Link to='/login' className='contrast'><div className={this.state.notLogged} onClick={this.clickHandler} >{this.translate('initSession') }</div></Link>
            <Link to='/user' className='contrast'><div className={this.state.loggedAs}>{this.translate('logged.as')}{this.state.nickName}</div></Link>
            <Link to='/register' className='contrast'><div className="basicBtn inline">{this.translate('create.account')}</div></Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <div>
              <h1>{this.translate('menu.channel').toUpperCase()}</h1>
            </div>
            <div className="section-container" >
              <div className="section-contain">
                <Channel initSchemma={this.props.initSchemma} auth={this.props.auth} />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-6">
            <div>
              <h1>{this.translate('menu.podcast').toUpperCase()}</h1>
            </div>
            <div className="section-container" >
              <div className="section-contain">
                <Podcast channel={localStorage.getItem('lastChannel') ? localStorage.getItem('lastChannel') : 'generic' } initSchemma={this.props.initSchemma} auth={this.props.auth} />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-6">
            <div>
              <h1>{this.translate('menu.episode').toUpperCase()}</h1>
            </div>
            <div className="section-container" >
              <div className="section-contain">
                <Episode podcast={localStorage.getItem('lastpodcast') ? localStorage.getItem('lastpodcast') : 'generic' } auth={this.props.auth} initplayer={this.props.initplayer} initSchemma={this.props.initSchemma}  />
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

Home.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Home);
export default Home;