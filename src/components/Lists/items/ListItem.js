import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js'
import './ListItem.scss'

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.


class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'selected':false
    };
    this.selectHandler = this.selectHandler.bind(this);
    this.goTo = this.goTo.bind(this);
  }
  goTo(){
    this.props.goTo(this.props.data);
  }
  selectHandler(event){
    this.setState({
      'selected':!this.state.selected
    })
    this.state.selected
    ? this.props.focus(this.selectHandler, 'children', event.target.id, event.target.getAttribute('name'), event.target.getAttribute('originId'), event.target.getAttribute('originName'))
    : null;
  }
  render() {
    return (
      <div class="list_item_container" >
        <div className={this.state.selected ? 'list_item item_selected': 'list_item' }  id={this.props.id} originId={this.props.originId} originName={this.props.originName} name={this.props.name} onClick={this.selectHandler} >{this.props.name}</div>
        <div className="itemGo" id={this.props.id} onClick={this.goTo} >Go</div>
      </div>
    )}
}

ListItem.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(ListItem);
export default ListItem;