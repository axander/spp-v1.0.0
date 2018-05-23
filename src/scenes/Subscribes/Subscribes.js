import React from 'react'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import SingleLayoutLater from '../../components/SingleLayout/SingleLayoutLater.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';

class Subscribes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': JSON.parse(localStorage.getItem('client')).listData.later
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="favourites">
        <h1>{this.translate('user.later').toUpperCase()}</h1>
            {
              UsuarioApi.options[this.props.match.path].map(p => (
                <Link key={p.number}  to={this.props.match.path+'/'+p.id} ><div className={ Utils.checkScene(this.props.match.path+'/'+p.id) ? 'tabList tabListSelected' : 'tabList' } >
                  {p.name}
                </div></Link>
              ))
            }
            <Route exact path={this.props.match.path+'/:id'} render={(props) => (
              <SingleLayoutLater data={this.state.data} initplayer={this.props.initplayer} />
            )}/>
        <Submenu  sub={this.props.match.path}/> 
      </div> 

    );
  }
}

Subscribes.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Subscribes);
export default Subscribes;