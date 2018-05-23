import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import Pages from '../../components/Pages/Pages.js'
import './Opinion.scss'


class OpinionStatic extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'init':true,
      'loading':true,
      'error':false,
      'data':{}
    }
    this.setPhase = this.setPhase.bind(this);
  }
  onSuccess = (_response) => {
    _response.status === 'successfull'
    ? (
        Utils.scrollTo(200,Utils.offset(document.querySelector('.opinion')).top-document.querySelector('.breadcrumb').offsetHeight),
        this.setState({
          'init':false,
          'loading':false,
          'error':false,
          'lan':localStorage.getItem('language'),
          'data':_response.data,
          'advice':_response.data.advice,
          'adviceEmail':_response.data.adviceEmail,
          'total':_response.total,
          'perPhase':_response.perPhase,
          'phase':parseFloat(localStorage.getItem('phase_opinion_'+this.props.origen)) || 0
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
  setPhase(_phase){
    window.setSpinner();//,
    API.action('getOpinion', { 'id' : this.props.origen, 'phase': this.state.phase || 0 }, this.onSuccess, this.onError, 'GET');
  }
  componentDidMount(){
      API.action('getOpinion', {'id' : this.props.origen, 'phase': 0 }, this.onSuccess, this.onError, 'GET');
  }
  render() {
    let PagesList, OpinionList ;
    if(this.state.total>0){
      PagesList = <Pages total={this.state.total} perPhase={this.state.perPhase}  setPhase= {this.setPhase} auth={this.props.auth} list="opinion" origen={this.props.origen} />
    }
    if(typeof this.state.data.collection !== 'undefined'){
      OpinionList = this.state.data.collection;
    }else{
      OpinionList  = [];
    }
    return (
      <div className='opinion' >
        <div className='row'>
          <div className='col-xs-12 col-md-6'>
            <div className='opinion_count' >{this.state.total} {this.translate('opinions')}</div>
          </div>
          <div className='col-xs-12 col-md-6'>
            <div className='opinion_advice' >{typeof this.state.advice !=='undefined' ? this.state.advice[this.state.lan] : ''}<a href={this.state.adviceEmail} className='opinion_advice_email' >{this.state.adviceEmail}</a></div>
          </div>
        </div>
        {OpinionList.map(( p , index) => {
            var avatar = { 'background':'url('+p.author.avatar+')'};
            var date = p.author.date.replace(/ /g,"T");
            return (
              <div className='row' >
                <div className='col-xs-12 col-md-3'>
                  <div className='opinion_author' >
                    <div className='opinion_author_avatar' style={avatar}></div>
                    <div className='opinion_author_data'>
                      <div className='opinion_author_data_name' >{p.author.name}</div>
                      <div className='opinion_author_data_date'>{ (new Date(date)).toLocaleDateString() }</div>
                    </div>
                    <div className='opinion_author_deco'>
                      <span class="icon-chevron-up_2"></span>
                    </div>
                    <div className='opinion_author_deco_responsive'><span class="icon-chevron-up_2"></span></div>
                  </div>
                </div>
                <div className='col-xs-12 col-md-9'>
                  <div className='opinion_text' >
                    <div>{p.opinion}</div>
                  {/*<div className='opinion_button' >{this.translate('toComment')}</div>*/}
                  </div>
                </div>
              </div>
            )
          })}
          
        <div class="row" >
          <div className="col-xs-12" >
            {PagesList}
          </div>
        </div>
        <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
        <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
      </div>
    );
  }
}

OpinionStatic.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(OpinionStatic);
export default OpinionStatic;