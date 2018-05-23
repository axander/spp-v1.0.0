import React from 'react'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import SingleLayoutShare from '../../components/SingleLayout/SingleLayoutShare.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';

class Shared extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': JSON.parse(localStorage.getItem('client')).listData.share
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="shared">
        <h1>{this.translate('user.shared').toUpperCase()}</h1>
            {
              UsuarioApi.options[this.props.match.path].map(p => (
                <Link key={p.number}  to={this.props.match.path+'/'+p.id} ><div className={ Utils.checkScene(this.props.match.path+'/'+p.id) ? 'tabList tabListSelected' : 'tabList' } >
                  {p.name}
                </div></Link>
              ))
            }
            <Route exact path={this.props.match.path+'/:id'} render={(props) => (
              <SingleLayoutShare data={this.state.data} initplayer={this.props.initplayer} />
            )}/>
        <Submenu  sub={this.props.match.path}/> 
      </div> 

    );
  }
}

Shared.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Shared);
export default Shared;