import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js';
import './Validate.scss'


class Validate extends React.Component {
  constructor(props) {
    super(props);
    
  }
  render() {
    return (
        <div>
          <validate>
            <div class='mt50 mb50 register_validate'>
              <div className="register_validate_hello" >{this.translate('hello')}!</div>
              <div className="register_validate_welcome" >{this.translate('welcome')}</div>
            </div>
          </validate>
        </div>  
    );
  }
}
Validate.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Validate);
export default Validate;