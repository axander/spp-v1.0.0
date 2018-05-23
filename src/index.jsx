import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx';

import Constants from './Constants.js';
import TranslationActionCreator from './actions/TranslationActionCreator.js';
import TranslationStore from './stores/TranslationStore.js';


import './styles.scss'


class AppComponent extends React.Component {
  /*constructor(props) {
    super(props);
  }*/
  refreshAdds(){
    typeof window.googletag !== 'undefined' && window.googletag.pubads ? window.googletag.pubads().refresh() : null;
    typeof window.gtag !== 'undefined'
    ? window.gtag('config', 'UA-92284023-5', {
      'page_title' : window.location.hash.split('/')[1],
      'page_path': window.location.hash.replace('#','')
    })
    : null;
  }
  componentDidMount() {
    window.addEventListener("hashchange", this.refreshAdds, false);
    // Trigger loading of the language file
    TranslationActionCreator.changeLanguage(Constants.DEFAULT_LANGUAGE, success => {
      localStorage.setItem('language', Constants.DEFAULT_LANGUAGE )
      if (success) {
        this.forceUpdate();
      }
      else {
        throw new Error('No translation available!');
      }
    });
  }

  render() {
    if (TranslationStore.getCurrentLanguage() === null) {
      return (
        <div className="app-wrapper">
          Cargando. Por favor, espere ...
        </div>
      );
    }

    return (
      <div className={ localStorage.getItem('app') ? "app-wrapper" : "app-wrapper_web" } >
        
        {/* No connection to the translation picker */}
        <HashRouter>
  	    	<App />
  	  	</HashRouter>
      </div>

    )
  }
}


render((
  <HashRouter>
    <AppComponent />
  </HashRouter>
), document.getElementById('root'));