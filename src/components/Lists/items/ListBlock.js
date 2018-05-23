import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js'
import './ListBlock.scss'

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.


class ListBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	'show': false,
      'selected':false
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.forceOpen = this.forceOpen.bind(this);
  }
  clickHandler(){
  	this.setState({
  		'show':!this.state.show
  	})
  }
  forceOpen(){
    this.setState({
      'show':true
    })
  }
  selectHandler(event){
    this.setState({
      'selected':!this.state.selected
      /*'show':true*/
    })
    this.state.selected
    ? this.props.focus(this.selectHandler, 'folder', event.target.id, event.target.getAttribute('name'), this.forceOpen)
    : null;
  }
  render() {
    return (
      <div className='list_block'>
      	<div className={this.state.selected ? 'folder folder_selected': 'folder' } >
      		<div className={this.state.selected ? 'blockDisabled' : '' }  onClick={this.selectHandler} id={this.props.id} name={this.props.folder} >{this.props.folder}</div>
      		<div onClick={this.clickHandler} >
      			<div className={this.state.show ? 'deco show': 'deco' } >►</div>
      		</div>
      	</div>
      	<div className={this.state.show ? 'content show': 'content' } data-mutant-attributes="height" >{this.props.recursive}</div>
      </div>
    )}
}

ListBlock.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(ListBlock);
export default ListBlock;