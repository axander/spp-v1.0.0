import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import './Date.scss'

class Date extends React.Component {
	constructor(props) {
	    super(props);
	 }
	render() {
	    return (
	        <div className="date" >
		    	<div>
			    	<div class='basicOuter'>
			            <div class='basicInner'>
			              <span class="icon-calendar"></span>
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
Date.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Date);
export default Date;