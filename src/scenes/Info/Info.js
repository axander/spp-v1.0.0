import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js'

import About from '../../components/Info/About.js'
import AdsInfo from '../../components/Info/AdsInfo.js'
import Ads from '../../components/Info/Ads.js'
import Basic from '../../components/Info/Basic.js'
import Cookies from '../../components/Info/Cookies.js'
import Explore from '../../components/Info/Explore.js'
import Help from '../../components/Info/Help.js'
import Invited from '../../components/Info/Invited.js'
import Legal from '../../components/Info/Legal.js'
import List from '../../components/Info/List.js'
import Player from '../../components/Info/Player.js'
import Premium from '../../components/Info/Premium.js'
import Privacity from '../../components/Info/Privacity.js'
import Contact from '../../components/Info/Contact.js'
import './info.scss'

class Info extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem('lastState',props.location.pathname);
    var orderStatics = {};
    var data = [];
    this.props.statics.data.length
    ? data = this.props.statics.data
    : data = JSON.parse(localStorage.getItem('statics'))
    for( var j in data){
      orderStatics[data[j].slug]=data[j];
    }
    this.state={
      'statics':orderStatics
    }
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    Utils.scrollToTop(300);
    // Will execute as normal
  }
  componentDidUpdate() {
    Utils.scrollToTop(300);
    // Will execute as normal
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize() {
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
  }
  render() {
    return (
          <div className="info" style={this.state.style}>
                <Switch>
                  <Route exact path='/info/about' render={(props) => (
                    <About {...props} statics={this.state.statics['quienes-somos']} />
                  )}/>
                  <Route exact path='/info/ads_info' render={(props) => (
                    <AdsInfo {...props} statics={this.state.statics['anunciate']}  />
                  )}/>
                  <Route exact path='/info/ads' render={(props) => (
                    <Ads {...props} statics={this.state.statics['anunciate']} />
                  )}/>
                  <Route exact path='/info/basic' render={(props) => (
                    <Basic {...props} statics={this.props.statics} />
                  )}/>
                  <Route exact path='/info/cookies' render={(props) => (
                    <Cookies {...props} statics={this.state.statics['politica-de-cookies']} />
                  )}/>
                  <Route exact path='/info/explore' render={(props) => (
                    <Explore {...props} statics={this.props.statics} />
                  )}/>
                  <Route exact path='/info/help_center' render={(props) => (
                    <Help {...props} statics={this.state.statics['centro-de-ayuda']} />
                  )}/>
                  <Route exact path='/info/invited' render={(props) => (
                    <Invited {...props} statics={this.props.statics} />
                  )}/>
                  <Route exact path='/info/legal' render={(props) => (
                    <Legal {...props} statics={this.state.statics['aviso-legal']} />
                  )}/>
                  <Route exact path='/info/list' render={(props) => (
                    <List {...props} statics={this.props.statics} />
                  )}/>
                  <Route exact path='/info/player' render={(props) => (
                    <Player {...props} statics={this.props.statics} />
                  )}/>
                  <Route exact path='/info/premium' render={(props) => (
                    <Premium {...props} statics={this.props.statics} />
                  )}/>
                   <Route exact path='/info/privacity' render={(props) => (
                    <Privacity {...props} statics={this.state.statics['politica-de-privacidad']} />
                  )}/>
                  <Route exact path='/info/contact' render={(props) => (
                    <Contact {...props} statics={this.state.statics['contactanos']} />
                  )}/>
                </Switch>
          </div>
    );
  }
}

Info.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Info);
export default Info;