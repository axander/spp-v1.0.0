import React from 'react'
import { Switch, Route } from 'react-router-dom'
import List from '../Lists/List.js'

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.


class SingleLayoutFav extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Switch>
            <Route exact path='/favourites/channel' render={(props) => (
              <List {...props} data={this.props.data.channel} what='channel' where='fav' />
            )}/>
            <Route exact path='/favourites/podcast' render={(props) => (
              <List {...props} data={this.props.data.podcast} what='podcast' where='fav' />
            )}/>
            <Route exact path='/favourites/episode' render={(props) => (
              <List {...props} data={this.props.data.episode} initplayer={this.props.initplayer} what='episode' where='fav' />
            )}/>
        </Switch>
        
      </div>

    )}
}

export default SingleLayoutFav