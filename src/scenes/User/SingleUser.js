// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.

import React from 'react'
import SingleUserAPI from '../../services/api.js'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';

class SingleUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'singleUser':SingleUserAPI.get(
        props.match.params.id
      )
    };
  }
  componentDidMount() {
    // Will execute as normal
    typeof document.getElementById('root')['submenu'] !== 'undefined' ? document.getElementById('root')['submenu'].handler= null : null;
  }
  render() {
    if (!this.state.singleUser) {
      return <div>Sorry, but the singleUser was not found</div>
    }else{
      return (
        <div className="basicOuter" >
          <div className="basicInner">
            <h1>{this.translate(this.state.singleUser.sub.replace('/','')+'.'+this.state.singleUser.id)}</h1>
            <h2>Position: {this.state.singleUser.position}</h2>
            <Link to='/user'><div className="backPB" >{this.translate('back')}</div></Link>
          </div>
        </div> 
      );
    }
    
  }
}
SingleUser.propTypes = {
  //who: React.PropTypes.string.isRequired,
};

// Returns nothing because it mutates the class
TranslatedComponent(SingleUser);
export default SingleUser;



