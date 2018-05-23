import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import './Like.scss'

class Like extends React.Component {
	constructor(props) {
	    super(props);
	 }
	render() {
	    return (
	        <div class='like' >
		    	<div>
			    	<div class='basicOuter'>
			            <div class='basicInner'>
			              <span className={this.props.data.isLiked ? "icon-thumbs-up icon-thumbs-up-red" : "icon-thumbs-up" } ></span>
			            </div>
			        </div>
			    </div>
			   	<div>
			    	<div class='basicOuter'>
			            <div class='basicInner'>
			              {this.props.data.info.likes}
			            </div>
			        </div>	
	        	</div>
	        </div>
	    )
	}
}
	//<div className={this.state.schemmaShow ? 'ListSchemma show':'ListSchemma' } ><ListSchemma schemma={this.state.schemma} /></div>
Like.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Like);
export default Like;