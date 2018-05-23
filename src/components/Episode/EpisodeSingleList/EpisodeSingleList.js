import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js'
import './episodeSingleList.scss'

class EpisodeSingleList extends React.Component {
  constructor(props) {
    super(props);
    
  }
  componentDidMount(){
      
  }
  render() {
    return (
      <div className='episodeSingleList' >
              <div class="row">
                <div class="col-xs-10">
                  <div className="episodeSingleList_rot" >{this.translate('blocks.'+this.props.destiny).toUpperCase()}</div>
                </div>
                <div className={this.props.restrict ? "hide" : "col-xs-2" }>
                    <Link to='/lists'><div className="episodeSingleList_all" >{this.translate('blocks.getAll')}</div></Link>
                  {/*<Link to={'/lists/'+this.props.destiny}><div className="episodeSingleList_all" >{this.translate('blocks.getAll')}</div></Link>*/}
                </div>
              </div>
      </div>
    );
  }
}

EpisodeSingleList.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(EpisodeSingleList);
export default EpisodeSingleList;