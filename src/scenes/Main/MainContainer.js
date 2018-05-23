import React from 'react'
import { Switch, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Home from '../Home/Home.js'
import Home_web from '../Home/web/Home_web.js'
import User from '../User/User.js'
import Content from '../Content/Content.js'
import Episode from '../Episode/Episode.js'
import Favourites from '../Favourites/Favourites.js'
import Favourites_web from '../Favourites/Favourites_web.js'
import Downloads from '../Downloads/Downloads.js'
import Downloads_web from '../Downloads/Downloads_web.js'
import Historial from '../Historial/Historial.js'
import Historial_web from '../Historial/Historial_web.js'
import Later from '../Later/Later.js'
import Later_web from '../Later/Later_web.js'
import Like_web from '../Like/Like_web.js'
import Listened_web from '../Listened/Listened_web.js'
import Subscribes from '../Subscribes/Subscribes.js'
import Subscribes_web from '../Subscribes/Subscribes_web.js'
import Shared from '../Shared/Shared.js'
import Shared_web from '../Shared/Shared_web.js'
import Profile from '../Profile/Profile.js'
import Lists from '../Lists/Lists.js'
import Subscription from '../Subscription/Subscription.js'
import Bills from '../Bills/Bills.js'
import DeleteAccount from '../User/DeleteAccount.js'
//import Podcast from '../Podcast/Podcast.js'
import StaticPlayer from '../../components/StaticPlayer/StaticPlayer.js'
/*import Premium from '../Premium/Premium.js'*/
import CancelPremiumProcess from '../Premium/CancelPremiumProcess.js'
import PremiumProccessOk from '../Premium/PremiumProccessOk.js'
import Promotional from '../Promotional/Promotional.js'
import './MainContainer.scss'


class MainContainer extends React.Component {
  render() {
    return (
      <div className='mainContainer' >
        <div className="main">
          <Switch>
            <Route exact path='/' component={ localStorage.getItem('app') ? Home : Home_web } />
            <Route path='/user' component={User} />
            <Route path='/content' component={Content}/>
            <Route path='/episode' component={Episode}/>

            <Route exact path='/favourites' render={(props) => (
              <Favourites {...props} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/lists/favourites' render={(props) => (
              <Favourites_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>

            <Route exact path='/downloads' render={(props) => (
              <Downloads {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/lists/downloads' render={(props) => (
              <Downloads_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>

            <Route exact path='/later' render={(props) => (
              <Later {...props} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/lists/later' render={(props) => (
              <Later_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>

            <Route exact path='/lists/like' render={(props) => (
              <Like_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/lists/listened' render={(props) => (
              <Listened_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>

            <Route exact path='/history' render={(props) => (
              <Historial {...props} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/lists/history' render={(props) => (
              <Historial_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>
           
            <Route exact path='/subscribes' render={(props) => (
              <Subscribes {...props} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/lists/subscribes' render={(props) => (
              <Subscribes_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>

            <Route exact path='/shared' render={(props) => (
              <Shared {...props} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/lists/shared' render={(props) => (
              <Shared_web {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>

            <Route exact path='/profile' render={(props) => (
              <Profile {...props}  auth={this.props.auth} />
            )}/>
            <Route exact path='/lists' render={(props) => (
              <Lists {...props} auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>
            <Route exact path='/subscription' render={(props) => (
              <Subscription {...props} auth={this.props.auth} />
            )}/>
            <Route exact path='/bills' render={(props) => (
              <Bills {...props} auth={this.props.auth} />
            )}/>
            <Route exact path='/deleteAccount' render={(props) => (
              <DeleteAccount {...props} auth={this.props.auth} />
            )}/>
            <Route exact path='/static/:episode/:name' render={(props) => (
              <StaticPlayer {...props} initSchemma={this.props.initSchemma}  initplayer={this.props.initplayer} auth={this.props.auth} />
            )}/>
            {/*<Route exact path='/premium' render={(props) => (
              <Premium {...props} initSchemma={this.props.initSchemma}  initplayer={this.props.initplayer} auth={this.props.auth} />
            )}/>*/}
            <Route exact path='/promotional' render={(props) => (
              <Promotional {...props} initSchemma={this.props.initSchemma}  initplayer={this.props.initplayer} auth={this.props.auth} />
            )}/>
            <Route exact path='/cancel-premium-process' render={(props) => (
              <CancelPremiumProcess {...props} initplayer={this.props.initplayer} auth={this.props.auth} />
            )}/>
            <Route exact path='/premium-process-ok' render={(props) => (
              <PremiumProccessOk {...props} initplayer={this.props.initplayer} auth={this.props.auth} />
            )}/>

            {/*<Route exact path='/podcast' render={(props) => (
              <Podcast {...props} initSchemma={this.props.initSchemma}  auth={this.props.auth}  />
            )}/>
            <Route exact path='/podcast/:channel/:name' render={(props) => (
              <Podcast {...props} initSchemma={this.props.initSchemma}  auth={this.props.auth} initplayer={this.props.initplayer} />
            )}/>*/}

            <Route exact path='/static/:episode/:name' render={(props) => (
              <StaticPlayer {...props} initSchemma={this.props.initSchemma}  initplayer={this.props.initplayer} auth={this.props.auth} />
            )}/>

          </Switch>
        </div>

      </div>
    );
  }
}

MainContainer.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(MainContainer);
export default MainContainer;