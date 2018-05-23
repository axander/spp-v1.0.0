import React from 'react'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import SingleLayout from '../../components/SingleLayout/SingleLayout.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
// The FullRoster iterates over all of the players and creates
// a link to their profile page.

class FullUser extends React.Component {
  /*constructor(props) {
    super(props);
  }*/
  componentDidMount() {
    // Will execute as normal
  }
  render() {
    return (
      <div className="basicOuter" >
        <div className="basicInner">
          <h1>{this.translate('menu.user').toUpperCase()}</h1>
          {
            UsuarioApi.options[this.props.match.path].map(p => (
              <Link key={p.id}  to={this.props.match.path+'/'+p.id} ><div className='submenuOp' >
                {this.translate(p.sub.replace('/','')+'.'+p.id)}
              </div></Link>
            ))
          }
          <Route path={this.props.match.path+'/:name'} component={SingleLayout} />
        </div>  
         <Submenu sub={this.props.match.path} />
      </div>
    );
  }
}

FullUser.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(FullUser);
export default FullUser;