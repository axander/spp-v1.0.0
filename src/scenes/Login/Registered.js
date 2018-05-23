import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import { Link } from 'react-router-dom'
import './registered.scss'

class Registered extends React.Component {
  componentWillUnmount() {
      
  }
  componentDidUpdate() {
    Utils.scrollToTop(300);
    // Will execute as normal
  }
  reloadLogOut(){
    Utils.scrollToTop(300);
    window.location.reload();
  }
  render() {
    return (
      <div className='mainContainer' >
        <registered>
          <div className='registered'>
            <div className="basicOuter" >
              <div className="basicInner">
                <h1>{this.translate('register.successfull')}</h1>
                <div>
                  <Link to={'.'+localStorage.getItem('lastState')} ><div className="registered-pb" onClick={this.reloadLogOut} >{this.translate('continue')}</div></Link>
                </div>
              </div>
            </div>
          </div>
        </registered>
      </div>
    );
  }
}

Registered.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Registered);
export default Registered;