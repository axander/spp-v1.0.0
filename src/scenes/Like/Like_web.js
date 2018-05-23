import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../../blocks/Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../../blocks/Common/LocalError/LocalError.js'
import List_web from '../../components/Lists/List_web.js'
import './Like_web.scss'

class Like_web extends React.Component {
  constructor(props) {
    localStorage.setItem('lastState',props.location.pathname);
    super(props);
    this.state={
    }
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount(){
    window.setSpinner();
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    
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
      <div className='like_web' style={this.state.style} >
                <h1>{this.translate('episodes.Liked')}</h1>
                <List_web list="like" item="episode" auth={this.props.auth} initplayer={this.props.initplayer}  />
                <h1>{this.translate('podcast.liked')}</h1>
                <List_web list="like" item="podcast" auth={this.props.auth} initplayer={this.props.initplayer}  />
      </div>
    );
  }
}

Like_web.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Like_web);
export default Like_web;