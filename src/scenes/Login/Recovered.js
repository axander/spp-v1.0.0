import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Utils from '../../utils/Utils.js'
import { Link } from 'react-router-dom'
import './registered.scss'

class Recovered extends React.Component {
  constructor(props) {
    super(props);
  }
 
  componentDidUpdate() {
    Utils.scrollToTop(300);
    // Will execute as normal
  }
  componentDidMount() {
    Utils.scrollToTop(300);
    // Will execute as normal
  }
 
  
  render() {
    return (
      <div className='mainContainer' style={this.state.style}>
        <registered>
          <div className='registered'>
            <div className="basicOuter" >
              <div className="basicInner">
                <h1>{this.translate('recover.successfull')}</h1>
                <div>
                  <Link to={'.'+localStorage.getItem('lastState')} ><div className="registered-pb" >{this.translate('continue')}</div></Link>
                </div>
              </div>
            </div>
          </div>
        </registered>
      </div>
    );
  }
}

Recovered.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Recovered);
export default Recovered;