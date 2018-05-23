import React from 'react'
import TranslatedComponent from '../utils/TranslatedComponent.js'

class FBPB extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      	'fb': localStorage.getItem('fb.status'),
    	'login': this.fb === 'connected' ? 'fbPBHide' : 'fbPBShow',
    	'logout': this.fb !=='connected' ? 'fbPBHide' : 'fbPBShow'
      };
  }
  componentWillReceiveProps() {
    this.setState({
      	'fb': localStorage.getItem('fb.status'),
    	'login': this.fb === 'connected' ? 'fbPBHide' : 'fbPBShow',
    	'logout': this.fb !== 'connected' ? 'fbPBHide' : 'fbPBShow'
      });
  }
  componentWillUnmount() {
  	this.setState({
      	'fb': localStorage.getItem('fb.status'),
    	'login': this.fb === 'connected' ? 'fbPBHide' : 'fbPBShow',
    	'logout': this.fb !== 'connected' ? 'fbPBHide' : 'fbPBShow'
      });
  }
  clickHandlerLogin(){
    window.loginFb(this.execFbOk)
  }
  clickHandlerLogout(){
    window.logoutFb()
  }
  render() {
  	
    if( this.state.fb !== 'connected' ){
      return(
        <fbPB>
          <div onClick={this.clickHandlerLogin} >
            <button class="loginBtn loginBtn--facebook" >{this.translate('login.facebook')}</button>
          </div>
          <div>
            <button class="loginBtn loginBtn--google">{this.translate('login.google')}</button>
          </div>
        </fbPB>
      )
    }else{
      return (
        <fbPB>
          <div onClick={this.clickHandlerLogout} >
            <button class="loginBtn loginBtn--facebook" >{this.translate('logout.facebook')}</button>
          </div>
          <div>
            <button class="loginBtn loginBtn--google">Login with Google</button>
          </div>
        </fbPB>
      )
    }
  }
}
//<PrivateRoute exact path='/*' component={AddPropsToRoute(MainContainer, this.props, fakeAuth )} />
FBPB.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(FBPB);
export default FBPB;


