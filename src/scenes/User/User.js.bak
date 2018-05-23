import React from 'react'
import { Switch, Route } from 'react-router-dom'
import FullUser from './FullUser.js'
import SingleUser from './SingleUser.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js';

// The Roster component matches one of two different routes
// depending on the full pathname



class User extends React.Component {

  componentDidMount() {
    // Will execute as normal
  }

  render() {
    return (
      <Switch>
	    <Route exact path='/user' component={FullUser}/>
	    <Route path='/user/:id' component={SingleUser} />
	</Switch>
    );
  }
}

User.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(User);
export default User;