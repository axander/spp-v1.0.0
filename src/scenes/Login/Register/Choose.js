import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js';
import {API} from '../../../services/Rest.js'
import './Choose.scss'

class Choose extends React.Component {
  constructor(props) {
    super(props);
     console.log('choose');
    console.log(this.props);
    this.state = {
     'refresh':0,
     'deactive': 'disabled',
     'basic':false,
     'premium':false,
     'type': null,
     'loading':true,
      'error':false,
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.resizeCard = this.resizeCard.bind(this);
  }
  clickHandler(_type){
    switch(_type){
      case 'Basic':
        this.setState({
          'Basic':true,
          'Premium':false,
          'deactive':'',
          'type': 'Basic'
        })
      break;
      case 'Premium':
        this.setState({
          'Basic':false,
          'Premium':true,
          'deactive':'',
          'type': 'Premium'
        })
      break;
      default:
      break;
    }
    this.props.subscription(_type);
  }
  onSuccess = (_response) => {
    _response.status === 'success'
    ? (
        this.setState({
          'init':false,
          'loading':false,
          'error':false,
          'data':_response.result
        })
      )
    : (
        this.setState({
          'init':false,
          'loading':false,
          'error':true
        })
      );
  }
  onError = (_response, _error) =>{
    this.setState({
          'init':false,
          'loading':false,
          'error':true
        })
  }
  resizeCard(){
    if(document.querySelector('#choose_register_item_features_0') && document.querySelector('#choose_register_item_features_1') && document.querySelector('#choose_register_item_features_1').offsetHeight > 0){
      var height1 = document.querySelector('#choose_register_item_features_0').offsetHeight;
      var height2 = document.querySelector('#choose_register_item_features_1').offsetHeight;
      var maxHeight = height1 <= height2 ? height2 : height1;
      document.querySelector('#choose_register_item_features_0').style.height = maxHeight + 'px';
      document.querySelector('#choose_register_item_features_1').style.height = maxHeight + 'px';
    }
  }
  componentDidMount(){
    this.props.Card.resize = this.resizeCard;
    window.setSpinner();
    API.action('getOffers', {}, this.onSuccess, this.onError, 'get', false, true);
  }
  render() {
    var lan = localStorage.getItem('language');
    if(typeof this.state.data !== 'undefined'){
      var collection = this.state.data;
    }else{
      collection = [];
    }
    return (
        <div style={this.state.style} >
          <choose>
            <div class='mt50 mb50 register_choose'>
              <div className='choose_register_content'>
                  {collection.map(( p , index) => {
                    var items
                    items = p.items.split(',')
                    p.style={
                      "background":"#fff",
                      "background-image":"",
                      "background-repeat": "no-repeat",
                      "background-size": "cover",
                      "background-position": "center center"
                    }
                    return (
                      <div className="choose_register_item" style={p.style} onClick={() => this.clickHandler(p.name)} >
                        <div className="choose_register_item_content" >
                          <div>
                            <div>
                              <div className="choose_register_item_selector" >
                                <div className={ this.state[p.name] ? "choose_register_item_selector_selected" : "hide"} ></div>
                              </div>
                            </div>
                            <div>
                              <div className="choose_register_item_user" >{p.before_title}</div>
                              <div className="choose_register_item_rate" >{p.title}</div>
                            </div>
                          </div>
                          <div className="choose_register_item_description" >{p.content}</div>
                          <div id={"choose_register_item_features_"+index} className="choose_register_item_features" >
                            { items.map(( q , index) => {
                              return(
                                  /*<div className={ q.status ? "choose_register_item_feature choose_register_item_feature_active" : "choose_register_item_feature" } ><div className="choose_register_item_feature_checkmark" >&#10004;</div><div className="choose_register_item_feature_txt" >{q.description[lan]}</div></div>*/
                                  <div className="choose_register_item_feature choose_register_item_feature_active" ><div className="choose_register_item_feature_checkmark" >&#10004;</div><div className="choose_register_item_feature_txt" >{q}</div></div>
                                )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
          </choose>
          <div className='register_choose_adjust mb50 '>

            <div className="right register_choose_continue" ><div className={"greenPB " + this.state.deactive }  onClick={() => this.props.flow(this.state,'choose')} >{this.state.type === 'Basic' ? this.translate('register.finalize') : this.translate('register.continue')}</div></div>
            <div className="left  register_choose_back" ><div className="neutralPB" onClick={() => this.props.back('intro')} >{this.translate('back2')}</div></div>
          </div>
        </div>  
    );
  }
}
Choose.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Choose);
export default Choose;