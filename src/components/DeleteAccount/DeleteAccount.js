import React from 'react'
import { Link } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import './DeleteAccount.scss'

class DeleteAccount extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className="deleteAccount" >
          <div className="deleteAccount_content mb50">
            <div>{this.translate('user.deleteAccountMessage')}</div>
            <div className="mt25"><Link to={'deleteAccount'} ><div className="neutralPB font20 font_med_grey" >{this.translate('user.deleteAccount')}</div></Link></div>
          </div>
        </div>
    );
  }
}

DeleteAccount.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(DeleteAccount);
export default DeleteAccount;