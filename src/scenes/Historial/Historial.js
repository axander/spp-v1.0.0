import React from 'react'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import SingleLayout from '../../components/SingleLayout/SingleLayout.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';

class Historial extends React.Component {
  /*constructor(props) {
    super(props);
  }*/
  componentDidMount() {
  }
  render() {
    return (
      <div className="history">
        <h1>{this.translate('user.history').toUpperCase()}</h1>
      </div> 
    );
  }
}

Historial.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Historial);
export default Historial;