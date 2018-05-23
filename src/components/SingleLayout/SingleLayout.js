import React from 'react'
import SingleUserAPI from '../../services/api.js'
import { Link, Switch, Route } from 'react-router-dom'

import PersonalData from '../../scenes/User/PersonalData.js'
import Invitations from '../../scenes/User/Invitations.js'
import Subscription from '../../scenes/User/Subscription.js'
import DeleteAccount from '../../scenes/User/DeleteAccount.js'
import BankData from '../../scenes/User/BankData.js'

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.
const SingleLayout = (props) => {
  const singleUser = SingleUserAPI.get(
    props.match.params.id
  )
  console.log('props');
  console.log(props);
  if (!singleUser) {
    return <div>Sorry, but the singleUser was not found</div>
  }
  return (
    <div>
      <h1>{singleUser.name} (#{singleUser.number})</h1>
      <h2>Position: {singleUser.position}</h2>
      <Switch>
          <Route path='/user/personalData' component={PersonalData} />
          <Route path='/user/invitations' component={Invitations} />
          <Route path='/user/subscriptionData' component={Subscription} />
          <Route path='/user/deleteAccount' component={DeleteAccount} />
          <Route path='/user/bankData' component={BankData}/>
      </Switch>
      <Link to={singleUser.sub}><div className="backPB" >Back</div></Link>
    </div>

  )
}

export default SingleLayout