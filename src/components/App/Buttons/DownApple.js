import React from 'react'
import ReactDOM from 'react-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import appleinc_dark from '../../../assets/images/appleinc_dark.png'
import appleinc_light from '../../../assets/images/appleinc_light.png' 
import './DownApple.scss'

class DownApple extends React.Component {

  render() {
    return (
	    <div className='downloadApple' >
	      <div className={ 'appDownload appDownload_'+localStorage.getItem('template')} >
	        <div>{this.translate('footer.appStore').toUpperCase()}</div>
	        <div><img src={ localStorage.getItem('template') === 'dark' ? appleinc_light : appleinc_dark } alt="appleinc" />App Store</div>
	      </div>
	    </div>
    );
  }
}

DownApple.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(DownApple);
export default DownApple;