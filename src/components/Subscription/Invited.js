import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';

// The Header creates links that can be used to navigate
// between routes.

class Invited extends React.Component {
	constructor(props) {
        super(props);
    }
    componentDidMount() {
	}
  	render() {
	  	return(
	  		<Link to='/user/invitations' >
	  			<div className='subsc_item' >
	  				<div>{this.translate('user.invited')}</div>
	  				<div className="subsc_ico" >I</div>
	  				<div>{this.props.data.code}</div>
	  				<div className={typeof this.props.data !=='undefined' && this.props.data.status === 1 ? '' : 'hide' } >{ this.props.data.status ? this.translate('areLeft') +':'+ Utils.timeElapsed(this.props.data.activationDate, 30 ) +' '+this.translate('days') : '' }</div>   
	  				<div className={typeof this.props.data !=='undefined' && this.props.data.status === 0 ? 'subsc_nonActive' : 'hide' } >
	  					{this.translate('user.subsNonActive')}
	  				</div>
	  				<div className={typeof this.props.data !=='undefined' && this.props.data.status === 1 ? 'subsc_active' : 'hide' } >
	  					{this.translate('user.subsActive')}
	  				</div>
	  				<div className={typeof this.props.data !=='undefined' && this.props.data.status === 2 ? 'code_lapsed' : 'hide' } >
	  					{this.translate('user.codeLapsed')}
	  				</div>
	  				<div className={this.props.data.status === 2 ? 'requireAttention' : 'hide'} >!</div>
	  			</div>
	  		</Link>
	  	)
	  }
}
Invited.propTypes = {
  //who: React.PropTypes.string.isRequired,
};
TranslatedComponent(Invited);
export default Invited

