import React from 'react'
import Submenu from '../../components/Submenu/Submenu.js'
import UsuarioApi from '../../services/api2.js'
import SingleLayout from '../../components/SingleLayout/SingleLayout.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';

class Content extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="basicOuter" >
        <div className="basicInner">
          <h1>{this.translate('menu.content').toUpperCase()}</h1>
           {
              UsuarioApi.options[this.props.match.path].map(p => (
                <Link key={p.id}  to={this.props.match.path+'/'+p.id} ><div className={ Utils.checkScene(this.props.match.path+'/'+p.id) ? 'submenuOp tabSelected' : 'submenuOp' } >
                  {p.name}
                </div></Link>
              ))
            }
            <Route path={this.props.match.path+'/:id'} component={SingleLayout} />
         </div> 
         <Submenu  sub={this.props.match.path}/> 
      </div>
    );
  }
}

Content.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Content);
export default Content;