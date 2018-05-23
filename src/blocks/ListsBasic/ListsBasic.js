import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import EpisodeSingleList from '../../components/Episode/EpisodeSingleList/EpisodeSingleList.js'
import List_web from '../../components/Lists/List_web.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import './ListsBasic.scss'

class ListsBasic extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
      
  }
  render() {
    let ClaimDiv;
    this.props.auth.typeUser !== 'premium'
    ? ClaimDiv = <div className="col-xs-12 col-md-4" >
                <div id='right1' >
                  
                </div>
              </div>
    : ClaimDiv = '';
    return (
      <div className='lists_basic' >
                
                <div className="row">
                  <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-md-8" : "col-xs-12 col-md-12" }>
                    <h1>{this.translate('blocks.listsBasic')}</h1>
                    <div>
                      <EpisodeSingleList initplayer={this.props.initplayer} destiny='later' />
                      <List_web list="later" item="episode" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' />
                    </div>
                    <div>
                      <EpisodeSingleList initplayer={this.props.initplayer} destiny='subscribes' />
                      <List_web list="subscribe" item="podcast" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' />
                    </div>
                    <Link to={'/lists'} ><div className="lists_basic_all" >{this.translate('blocks.allMyLists')}</div></Link>
                  </div>
                  {ClaimDiv} 
                </div>
      </div>
    );
  }
}

ListsBasic.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(ListsBasic);
export default ListsBasic;