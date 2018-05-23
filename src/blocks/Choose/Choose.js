import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import Utils from '../../utils/Utils.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import './Choose.scss'

class Choose extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'init':true,
      'loading':true,
      'error':false,
      'fase':0
    }
    this.handleResize = this.handleResize.bind(this);
    this.leftFunction = this.leftFunction.bind(this);
    this.rightFunction = this.rightFunction.bind(this);
    this.clickBallHandler = this.clickBallHandler.bind(this);
    this.clickCardHandler = this.clickCardHandler.bind(this);
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
  clickBallHandler(event){
    this.setState({
      'fase': event.target.id.replace('ball_item_','')
    })
    //document.querySelector('.choose_episodes_content').style.left = - this.state.fase * document.querySelector('.choose_episodes_content_container').offsetWidth + 'px'
    this.handleResize();
  }
  clickCardHandler(event){
    event.target.className.indexOf('choose-item-PB') <= -1
    ?(
      !this.state.fase
        ? this.setState({
              'fase':1
            })
        : this.setState({
          'fase':0
        }),
      this.handleResize()
    )
    : null;
  }
  leftFunction(){
    !this.state.fase
    ? this.setState({
          'fase':1
        })
    : null;
   this.handleResize();
  }
  handleResize() {
    var elem = document.querySelector('.choose_episodes_content');
    elem.style.left = - this.state.fase * 260 +  ( document.querySelector('.choose_episodes_content_container').offsetWidth/2 - 132.5 ) + 'px';
    if(document.querySelector('#choose_item_features_0') && document.querySelector('#choose_item_features_1')){
      var height1 = document.querySelector('#choose_item_features_0').offsetHeight;
      var height2 = document.querySelector('#choose_item_features_1').offsetHeight;
      var maxHeight = height1 <= height2 ? height2 : height1;
      document.querySelector('#choose_item_features_0').style.height = maxHeight + 'px';
      document.querySelector('#choose_item_features_1').style.height = maxHeight + 'px';
    }
  }
  rightFunction(){
    this.state.fase
    ? this.setState({
          'fase':0
        })
    : null;
    this.handleResize();
  }
  componentDidMount(){
    window.setSpinner();
    window.addEventListener('resize', this.handleResize);
      API.action('getOffers', {}, this.onSuccess, this.onError, 'get', false, true);
      Utils.swipedetect(document.querySelector('.choose'), function(swipedir, toLeft, toRight) {
          switch (swipedir) {
              case "left":
                  if (toLeft != undefined) {
                      toLeft();
                  }
                  break;
              case "right":
                  if (toRight != undefined) {
                      toRight();
                  }
                  break;
              case "up":
                  break;
              case "down":
                  break;
              case "none":
                  break;
          }
      }, this.leftFunction, this.rightFunction
    );
  }
  componentDidUpdate() {
    if(document.querySelector('#choose_item_features_0') && document.querySelector('#choose_item_features_1')){
      var height1 = document.querySelector('#choose_item_features_0').offsetHeight;
      var height2 = document.querySelector('#choose_item_features_1').offsetHeight;
      var maxHeight = height1 <= height2 ? height2 : height1;
      document.querySelector('#choose_item_features_0').style.height = maxHeight + 'px';
      document.querySelector('#choose_item_features_1').style.height = maxHeight + 'px';
    }
    this.handleResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  render() {
    var lan = localStorage.getItem('language');
    if(typeof this.state.data !== 'undefined'){
      var collection = this.state.data;
    }else{
      collection = [];
    }
    if(typeof this.state.data !== 'undefined' && this.state.data.style !== 'undefined'){
      var style = this.state.data.style;
    }else{
      style = {
        "background":"#000",
        "height":"auto",
        "background-image":"",
          "background-repeat": "no-repeat",
          "background-size": "cover",
          "background-position": "center center"
      };
    }
    if(typeof this.state.data !== 'undefined' && typeof this.state.data.title !== 'undefined'){
      var title = this.state.data.title[lan];
    }else{
      title = {
        "es":"Tu eliges",
        "en":"You choose"
      };
    }
    return (
      <div className='choose' >
                <div className='choose_episodes' style={style} >
                <div className='choose_episodes_tittle' >{this.translate('offer.title')}</div>
                <div className='choose_episodes_content_container'>
                  <div className='choose_episodes_content'>
                    {collection.map(( p , index) => {
                      var PB
                      p.name === 'Basic'
                      ? (
                        p.btnText = {
                          "en":"Register now",
                          "es":"Regístrate ahora",
                          "style":{
                            "background-color":"#67b511"
                          }
                        },
                        p.externalLink = '',
                        p.route = 'register'
                      )
                      : (
                        p.btnText = {
                          "en":"Go Premium",
                          "es":"Hazte Premium",
                          "style":{
                            "background-color":"#000"
                          }
                        },
                        p.externalLink = '',
                        p.route = 'register'
                      )
                      var items
                      items = p.items.split(',')
                      return (
                        <div id={'card_item_'+index} className="choose_item" onClick={this.clickCardHandler} >
                          <div className={this.state.fase == index ? "choose_item_card choose_item_card_focus" : this.state.fase < index ? "choose_item_card choose_item_card_left" : "choose_item_card choose_item_card_right"} >
                            <div className="choose_item_content" >
                              <div className="choose_item_user" >{p.before_title}</div>
                              <div className="choose_item_rate" >{p.title.split('/')[0]}<span className="choose_item_rate_low">{index ? '/' : ''}{p.title.split('/')[1]}</span></div>
                              <div className="choose_item_description" >{p.content}</div>
                              <div id={'choose_item_features_'+index} className="choose_item_features" >
                                { 
                                  items.map(( q , index) => {
                                  return(
                                      /*<div className={ q.status ? "choose_item_feature choose_item_feature_active" : "choose_item_feature" } ><div className="choose_item_feature_checkmark" >&#10004;</div><div className="choose_item_feature_txt" >{q.description[lan]}</div></div>*/
                                      <div className="choose_item_feature choose_item_feature_active"><div className="choose_item_feature_checkmark" >✓</div><div className="choose_item_feature_txt" >{q}</div></div>
                                    )
                                })

                                }
                              </div>
                              <a href={p.externalLink} target='_blank' className={typeof p.externalLink === 'undefined' || p.externalLink.length <= 0 ? 'hidden':'' } ><div className={!index ? 'choose-item-PB choose-item-PB-'+index : 'choose-item-PB choose-item-PB-'+index}  style={p.btnText['style']} >
                                  <div className="choose_item_feature" ><span>{p.btnText[lan]}</span></div>
                              </div></a>
                              <div className={typeof p.route === 'undefined' || p.route.length <= 0 ? 'hidden':'' }><Link to={'/'+p.route} ><div className={!index ? 'choose-item-PB choose-item-PB-'+index : 'choose-item-PB choose-item-PB-'+index} style={p.btnText['style']} >
                                  <div className="choose_item_feature" ><span>{p.btnText[lan]}</span></div>
                              </div></Link></div>
                            </div>
                          </div> 
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className='balls'>
                {collection.map((p , index) => {
                  return (
                    <div className='ball-item'  >
                      <div id={'ball_item_'+index} className={ index == this.state.fase ? 'hidden':'bullEnabled'} onClick={this.clickBallHandler} >&bull;</div>
                      <div className={ index != this.state.fase ? 'hidden':'bullDisabled'}   >&bull;</div>
                    </div>
                  )
                })}
              </div>
              <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
              <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
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