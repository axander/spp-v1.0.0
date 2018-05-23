import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';

class RightAdd extends React.Component {


  /*shouldComponentUpdate(nextProps, nextState) {
    return false;
  }*/
  render() {
    return (
        <div className="col-xs-12 col-md-4" >
          <div id='right1' >
            
          </div>
        </div>
    );
  }
}

RightAdd.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(RightAdd);
export default RightAdd;