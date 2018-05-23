import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Login_web from './Login_web.js'
import Search from '../../../components/Search/Search.js'
import Logo from '../../../components/Logo/Logo.js'
import LogoResponsive from '../../../components/Logo/LogoResponsive.js'
import './styles/header_web.scss'

const bodyScroll = {
  posY:0
}


class Header_web extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'registerHide':localStorage.getItem('logged')
    }
    this.showRegister=this.showRegister.bind(this);
    this.showMenuResponsive= this.showMenuResponsive.bind(this);
    this.hideMenuResponsive= this.hideMenuResponsive.bind(this);
    this.getPremium = this.getPremium.bind(this);
  }
  showRegister(){
    this.setState({
      'registerHide':false
    })
  }
  hideMenuResponsive(){
    document.querySelector('.main').style.height='auto';
    window.scrollTo(0,bodyScroll.posY);
    this.setState({
      'menuResponsive':''
    })
  }
  showMenuResponsive(){
    bodyScroll.posY =window.scrollY;
    document.querySelector('.main').style.height=window.innerHeight;
    this.setState({
      'menuResponsive':'menu_responsive_show'
    })
  }
  goPremium(){
    window.location.href = '/#/premium';
  }
  getPremium(){
    this.goPremium()
    /*this.props.login.isAuthenticated
    ? this.goPremium()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.login.required(this.goPremium)
     )*/
  }
  componentDidMount(){
    /*document.querySelector('menu').addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);*/
  }
  render() {
    let registerHide = localStorage.getItem('logged');
    return (
      <div className={ 'header_web header_web_'+localStorage.getItem('template') }>
      <div id="contadorxxx"></div>
        <div className='header_web_main'>
          <div class="header_web_explore option left pr20"><Link to={'/explorar'} ><div class=''>{this.translate('header.explore').toUpperCase()}</div></Link></div>
          <div class="header_web_explore option left pr20 menu_responsive_pb" onClick={this.showMenuResponsive} >☰</div>
          <div className={!this.props.login.typeUser || this.props.login.typeUser === 'basic' ? 'header_web_premium option left' : 'hide' }  onClick={this.getPremium} ><div class=''>{this.translate('header.premium').toUpperCase()}</div></div>
          <Link to={'/'} >
            <div class='option logo'><Logo /></div>
            <div class='option logoResponsive'><LogoResponsive /></div>
          </Link>
          
          <div class='avatar right'><Login_web login={this.props.login} showRegister={this.showRegister} header={this.props.header} /></div>
          <div className={ this.state.registerHide ?'hide' : 'header_web_register option right' } ><Link to={'/register'} ><div>{this.translate('header.register').toUpperCase()}</div></Link></div>
          <Search />
          <div id="menu" className={"menu_responsive " + this.state.menuResponsive} onClick={this.hideMenuResponsive} >
            <div className="menu_responsive_option" >
              <span class="icon-x"></span>
            </div>
            <div><Link to='/explorar' ><div className="menu_responsive_option" >{this.translate('header.explore').toUpperCase()}</div></Link></div>
            <div className={this.props.login.typeUser === 'basic' ? '' : 'hide' } ><Link to='/premium' ><div className="menu_responsive_option" >{this.translate('header.premium').toUpperCase()}</div></Link></div>
            <div className={ this.state.registerHide ?'hide' : 'menu_responsive_option' } ><Link to='/register' ><div  >{this.translate('header.register').toUpperCase()}</div></Link></div>
            
          </div>
        </div>
      </div>  
    );
  }
}

Header_web.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Header_web);
export default Header_web;