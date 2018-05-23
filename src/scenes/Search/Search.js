import React from 'react'
import {API} from '../../services/Rest.js'
import { Link, Route } from 'react-router-dom'
import Utils from '../../utils/Utils.js'
import Claim from '../../blocks/Claim/Claim.js'
import Lists_search from '../../components/Lists/Lists_search.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import './Search.scss'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    }
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount(){
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    Utils.scrollToTop(300); 
    window.addEventListener('resize', this.handleResize);
    window.spinnerHide = false;
    window.setSpinner()
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
    let none;
    let data = JSON.parse(localStorage.getItem('lastSearch'));
    !data['canals'].result.length && !data['episodes'].result.length && !data['podcasts'].result.length
    ? none = true
    : none = false;
    let ClaimDiv;
    this.props.auth.typeUser !== 'premium'
    ? ClaimDiv = <div className="col-xs-12 col-sm-4" >
          <div id='right1' >
           
          </div>
          <Claim />
        </div>
      : ClaimDiv = '';
    return (
      <div className='search' style={this.state.style}  >
        <div class="row">
          <div className={this.props.auth.typeUser !== 'premium' ? 'col-xs-12 col-sm-8' : 'col-xs-12' } >
            <div className={ none ?  'mt50' : 'search'}  >
              <h1>{this.translate('search')}</h1>
              <div className={ none ? 'search_empty' : 'hide' } >
                <div>{this.translate('user.listEmptySearch')}</div>
              </div>
              <div className={none ? 'hide' : '' } >
                <div className={!data['canals'].result.length ? 'hide' : ''} >
                  <h1>{this.translate('search.channel')}</h1>
                  <Lists_search item="canals" auth={this.props.auth} initplayer={this.props.initplayer}  />
                </div>
                <div className={!data['podcasts'].result.length ? 'hide' : ''}>
                  <h1>{this.translate('search.podcast')}</h1>
                  <Lists_search item="podcasts" auth={this.props.auth} initplayer={this.props.initplayer}  />
                </div>
                <div className={!data['episodes'].result.length ? 'hide' : ''}>
                  <h1>{this.translate('search.episode')}</h1>
                  <Lists_search item="episodes" auth={this.props.auth} initplayer={this.props.initplayer}  />
                </div>
              </div>
            </div>
          </div>
          {ClaimDiv}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Search);
export default Search;