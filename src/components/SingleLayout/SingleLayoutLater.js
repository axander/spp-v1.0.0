import React from 'react'
import { Switch, Route } from 'react-router-dom'
import List from '../Lists/List.js'

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.


class SingleLayoutLater extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Switch>
            <Route exact path='/later/channel' render={(props) => (
              <List {...props} data={this.props.data.channel} what='channel' where='later' />
            )}/>
            <Route exact path='/later/podcast' render={(props) => (
              <List {...props} data={this.props.data.podcast} what='podcast' where='later' />
            )}/>
            <Route exact path='/later/episode' render={(props) => (
              <List {...props} data={this.props.data.episode} initplayer={this.props.initplayer} what='episode' where='later' />
            )}/>
        </Switch>
        
      </div>

    )}
}

export default SingleLayoutLater