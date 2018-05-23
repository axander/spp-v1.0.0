import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './LocalError.scss'

class LocalError extends React.Component {
  render() {
    return (
      <div className="localError" >
        <div>
          <h1>LocalError</h1>
        </div>
      </div>
    );
  }
}

LocalError.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(LocalError);
export default LocalError;