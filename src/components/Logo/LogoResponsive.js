import React from 'react'
import ReactDOM from 'react-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import logoResponsive from '../../assets/images/spmradiomovil.svg'
import './LogoResponsive.scss'

class LogoResponsive extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentDidUpdate(){
    
  }
  clickHandler(event){
    
  }

  render() {
    return (
      <div classsName="logoResponsive" >
        <img src={logoResponsive} alt="logo" />
      </div>  
    );
  }
}

LogoResponsive.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(LogoResponsive);
export default LogoResponsive;