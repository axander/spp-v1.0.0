import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import { Link } from 'react-router-dom'
import './logout.scss'

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
      
  }
  componentDidMount(){
    this.props.auth.isAuthenticated = false;
    this.props.initplayer.reset();
  }
  componentDidUpdate() {
    Utils.scrollToTop(300);
    // Will execute as normal
  }
  reloadLogOut(){
    window.location.reload();
  }
  render() {
    return (
      <div className='mainContainer' >
        <logout>
          <div className='logout'>
            <div className="basicOuter" >
              <div className="basicInner">
                <h1>{this.translate('sesionClosed')}</h1>
                <h1>{this.translate('bye')}</h1>
                <div>
                  <Link to='/'><div className="logout-session-close-pb" onClick={this.reloadLogOut} >{this.translate('continue')}</div></Link>
                </div>
              </div>
            </div>
          </div>
        </logout>
      </div>
    );
  }
}

Logout.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Logout);
export default Logout;