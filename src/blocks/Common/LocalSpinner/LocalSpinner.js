import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './LocalSpinner.scss'

class LocalSpinner extends React.Component {
  render() {
    return (
      <div className="localSpinner" >
        <div>
          <h1>Cargando...</h1>
        </div>
      </div>
    );
  }
}

LocalSpinner.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(LocalSpinner);
export default LocalSpinner;