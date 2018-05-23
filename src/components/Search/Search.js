import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { Modal, API } from '../../services/Rest.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Logo from '../../components/Logo/Logo.js'
import './search.scss'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'toogle':false,
      'text':'',
      'searchValidation':false,
      'searchValidationInit':false
    };
    this.clickHandler= this.clickHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clickHandlerSearch = this.clickHandlerSearch.bind(this);
  }
  onSuccess = (_response) => {
    
    _response.status === 'success'
    ? ( 
      localStorage.setItem('lastSearch',JSON.stringify(_response.data)),
      window.location.href='#/search',
      localStorage.getItem('lastSearch') ? window.location.reload() : null
    )
    : this.setState({
          isOpen: true,
          showedMsg: 'user.form.' + _response.reason
    });
    
  }
  onError = (_response, _error) =>{
    this.setState({
          isOpen: true,
          showedMsg: _error
      });
  }
  componentDidMount() {
    window.spinnerHide = false;
    window.setSpinner()
  }
  componentDidUpdate(){
    
  }
  keyPress(e){
    if (event.keyCode === 13 && this.state.searchValidation){
      this.clickHandlerSearch();
    }
  }
  handleChange(event) {
    switch(event.target.id){
      case 'searchInput':
          console.log(event.target.value);
          event.target.value.length<3
          ? this.setState({
            'text':event.target.value,
            'searchValidation':false,
            'searchValidationInit':true
          })
          : this.setState({
            'text':event.target.value,
            'searchValidation':true,
            'searchValidationInit':true
          })
      break;
      default:
      break
    }
  }
  clickHandlerSearch(event){
    this.setState({
      'toogle':!this.state.toogle
    })
    API.action('search', { 'text': this.state.text }, this.onSuccess, this.onError, 'GET', false, true);//,
    window.setSpinner();
  }
  clickHandler(event){
    this.setState({
      'toogle':!this.state.toogle
    })
    this.state.toogle
    ? document.querySelector('#searchInput').focus()
    : null
  }


  render() {
    return (
      <search className="searching" >
        <div className="pb" onClick={this.clickHandler} ><span class="icon-search"></span></div>
        <div className={ this.state.toogle ? 'container show' : 'container' } >
          <div className="search_logo" >
            <div class='option logo'><Logo /></div>
          </div>
          <div className="search_text" ><input id='searchInput' onKeyPress={(e) => this.keyPress(e)} type="text" width="80%" placeholder='Busca episodes, podcastas, episodios, canales, radios online, usuarios...' onChange={(value) => this.handleChange(value) } /></div>
          <div className={ this.state.searchValidationInit && ( this.state.text === '' || !this.state.searchValidation ) ? 'notValidSearch_msg' : 'hide'}  >{this.translate('search.notValid')}</div>
          <div className="search_pb_container"  >
            <div className="search_close_pb" onClick={this.clickHandler} >
              <span class="icon-x"></span>
            </div>
          </div>
          <div className={this.state.text.length >= 3 ? 'search_pb_container' : 'hide'}  >
            <div className="search_pb" onClick={this.clickHandlerSearch} >
              <span class="icon-search" ></span>
            </div>
          </div>
        </div>
      </search>  
    );
  }
}

Search.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Search);
export default Search;