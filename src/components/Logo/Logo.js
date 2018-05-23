import React from 'react'
import ReactDOM from 'react-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import logo from '../../assets/images/spmradio.svg'
import './Logo.scss'

class Logo extends React.Component {
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
      <div className="logo" >
        <img src={'.'+logo} alt="logo" />
      </div>  
    );
  }
}

Logo.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Logo);
export default Logo;