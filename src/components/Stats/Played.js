import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import './Played.scss'

class Played extends React.Component {
	constructor(props) {
	    super(props);
	 }
	render() {
	    return (
	        <div className="played" >
		    	<div>
			    	<div class='basicOuter'>
			            <div class='basicInner'>
			              <span class="icon-headphones"></span>
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
Played.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Played);
export default Played;