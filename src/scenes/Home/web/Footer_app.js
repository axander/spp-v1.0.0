import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import './styles/footer_web.scss'
import googlePlay from '../../../assets/images/googlePlay.png' 

import DownApple from '../../../components/App/Buttons/DownApple.js';
import DownAndroid from '../../../components/App/Buttons/DownAndroid.js';


class Footer_app extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentDidUpdate(){
    
  }

  render() {
    return (
      <div class="footer_app" >
       	<h1>{this.translate('footer.downloads').toUpperCase()}</h1>
        <div class="row" >
          <div class="col-xs-12 col-lg-6" ><DownApple /></div>
          <div class="col-xs-12 col-lg-6" ><DownAndroid /></div>
        </div>
        
      </div>  
    );
  }
}

Footer_app.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Footer_app);
export default Footer_app;