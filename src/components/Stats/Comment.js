import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import './Comment.scss'

class Comment extends React.Component {
	constructor(props) {
	    super(props);
	 }
	render() {
	    return (
	    	<div className="comment" >
		    	<div>
			    	<div class='basicOuter'>
			            <div class='basicInner'>
			              <span class="icon-message-square"></span>
			            </div>
			        </div>
			    </div>
			   	<div>
			    	<div class='basicOuter'>
			            <div class='basicInner'>
			              {this.props.num}
			            </div>
			        </div>	
	        	</div>
	        </div>
	    )
	}
}
	//<div className={this.state.schemmaShow ? 'ListSchemma show':'ListSchemma' } ><ListSchemma schemma={this.state.schemma} /></div>
Comment.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Comment);
export default Comment;