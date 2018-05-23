import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import './Ads.scss'

class Ads extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'resizing':true,
      'up990':window.innerWidth >= 990 ? true : false ,
      'down990':window.innerWidth < 990 ? true : false,
      'change':false
    }
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount(){

    window.googletag.cmd.push(function() { window.googletag.display('top'); })
    window.addEventListener('resize', this.handleResize);
  }
  handleResize() {
    this.setState({
      'up990':window.innerWidth >= 990 ? true : false ,
      'down990':window.innerWidth < 990 ? true : false,
      'change': ( window.innerWidth >= 990 && !this.state.up990 ) || ( window.innerWidth < 990 && !this.state.down990  ) ? true : false
    })
    console.log(this.state.up990);
    console.log(this.state.down990);
  }
  render() {
      this.state.change
      ? (
        typeof window.googletag !== 'undefined' && window.googletag.pubads ? window.googletag.pubads().refresh() : null,
        this.state.change = false
      )
      : null
      /*let Ad
      if(typeof this.state.data !== 'undefined' && this.state.data.externalLink && this.state.data.externalLink.length>0){
          Ad =<a href={this.state.data.externalLink} target='_blank' ><div className='ads' style={this.state.style}></div></a>;
        }else if(typeof this.state.data !== 'undefined' && this.state.data.route && this.state.data.route.length>0){
          Ad =<Link to={'/'+this.state.data.route} ><div className='ads' style={this.state.style}></div></Link>;
        }else{
          Ad =<div className='ads' style={this.state.style}></div>;
        }*/
        return (
            <div className='ads' >
              <div id='top'>
                  
              </div>
            </div>
          );
    /*return (
      <div className='ads' style={this.state.style}>
        <div className={this.state.loading ? 'hide':'content'} >
          <div className={ typeof this.state.data === 'undefined' || !this.state.data.externalLink || this.state.data.externalLink.length<=0  ? 'hide':'' } >
            <a href={this.state.data.externalLink} target='_blank' ></a>
          </div>
          <div className={ typeof this.state.data === 'undefined' || !this.state.data.route || this.state.data.route.length<=0  ? 'hide':'' } >
            <Link to={'/'+this.state.data.route} ></Link>
          </div>
        </div>
        <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
        <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );*/
  }
}

Ads.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Ads);
export default Ads;