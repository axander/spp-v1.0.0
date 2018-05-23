import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../Common/LocalError/LocalError.js'
import Pages from '../../components/Pages/Pages.js'
import './Opinion.scss'

const opinionData = {
  response : {}
};

class Opinion extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'comment':'',
      'init':true,
      'loading':true,
      'error':false,
      'type':this.props.type,
      'deactive':'disabled',
      'origen':this.props.origen,
      'acumulate':0
    }
    this.setPhase = this.setPhase.bind(this);
    this.refreshStaticOpinion = this.refreshStaticOpinion.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.toSaveComment = this.toSaveComment.bind(this);
  }
  handleChange(event) {
    switch(event.target.id){
      case 'comment':
          console.log(event.target.value);
          this.setState({[event.target.id]:event.target.value});
      break;
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.state.comment !== ''
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
    
  }
  toSaveComment(){
    this.setState({
      'action':'add'
    })
    localStorage.setItem('phase_opinion_'+this.props.origen, 0);
    API.action('saveOpinion', {'item_id' : this.state.origen, 'comment':this.state.comment  , 'type_item':this.state.type }, this.onSuccessAction, this.onError, 'GET', false, true);
  }
  saveComment(){
    this.props.auth.isAuthenticated
      ? this.toSaveComment()
      : (
        localStorage.setItem('opinionNotLogged', true),
        localStorage.setItem('savingList',true),
        localStorage.getItem('app')
        ? null
        : this.props.auth.required(this.toSaveComment)
      )
  }
  deleteComment(_id){
    this.setState({
      'action':'del'
    });
    API.action('deleteOpinion', {}, this.onSuccessAction, this.onError, 'GET', false, true, {'param': _id});
  }
  onSuccessAction  = (_response) => {
    _response.status === 'success'
    ? (
        this.setState({
          'init':false,
          'loading':true,
          'error':false,
          'comment':'',
          'acumulate':this.state.action === 'add' ? this.state.acumulate-1 : this.state.acumulate+1
        }),
        API.action('getOpinion', {'item_id' : this.props.origen, 'phase': parseFloat(localStorage.getItem('phase_opinion_'+this.props.origen)) || 0, 'type_item':this.state.type  }, this.onSuccess, this.onError, 'GET', false, true)
      )
    : (
        this.setState({
          'init':false,
          'loading':false,
          'error':false,
        })
      );
  }
  onSuccess = (_response) => {
    _response.status === 'success'
    ? (
        opinionData.response = _response,
        this.state.fromStatic
        ? this.state.fromStatic = false
        : Utils.scrollTo(200,Utils.offset(document.querySelector('.opinion')).top-document.querySelector('.breadcrumb').offsetHeight),
        this.setState({
          'init':false,
          'loading':false,
          'lan':localStorage.getItem('language'),
          'phase':parseFloat(localStorage.getItem('phase_opinion_'+this.props.origen)) || 0,
          'total':_response.total,
          'comment':'',
          'deactive':'disabled',
          'error':false
        }),
        localStorage.getItem('opinionNotLogged')
        ? ( 
          Utils.scrollTo(200,Utils.offset(document.querySelector('.opinion')).top-document.querySelector('.breadcrumb').offsetHeight),
          localStorage.removeItem('opinionNotLogged')
          )
        :null
      )
    : (
        this.setState({
          'init':false,
          'loading':false,
          'error':false
        })
      );
  }
  onError = (_response, _error) =>{
    this.setState({
          'init':false,
          'loading':false,
          'error':false
        })
  }
  setPhase(_phase){
    window.setSpinner();//,
    API.action('getOpinion', { 'item_id' : this.props.origen, 'phase': _phase || 0 , 'type_item':this.state.type }, this.onSuccess, this.onError, 'GET', false, true);
  }
  refreshStaticOpinion(_id){
      this.state.fromStatic = true;
      window.setSpinner();
      API.action('getOpinion', {'item_id' : _id, 'phase': parseFloat(localStorage.getItem('phase_opinion_'+_id)) || 0 , 'type_item':this.state.type }, this.onSuccess, this.onError, 'GET', false, true);
  }
  componentDidMount(){
      
      this.props.update.refresh = this.refreshStaticOpinion;
      API.action('getOpinion', {'item_id' : this.props.origen, 'phase': parseFloat(localStorage.getItem('phase_opinion_'+this.props.origen)) || 0, 'type_item':this.state.type  }, this.onSuccess, this.onError, 'GET', false, true);
  }
  componentWillUpdate(){
    /*var input = document.querySelector('comment');
    input
    ? input.onchange = (e) => {
        this.handleChange(e);
      }
    : null;*/
    !this.state.loading
    ? this.setState({
          'error':false,
          'lan':localStorage.getItem('language'),
          'data':opinionData.response.result,
          'advice':this.translate('opinion.advice'),
          'adviceEmail':this.translate('opinion.adviceEmail'),
          'total':opinionData.response.total,
          'perPhase':opinionData.response.perPhase,
          'phase':parseFloat(localStorage.getItem('phase_opinion_'+this.props.origen)) || 0
        })
    : null;
  }
  render() {
    let owner = {'nickname':'undefined','id':2345,'avatar':'undefined'}
    let from, to;
    localStorage.getItem('client')
    ? owner = JSON.parse(localStorage.getItem('client')).personalData 
    : null
    if(this.state.loading)
      return
    let PagesList, OpinionList ;
    if(opinionData.response.total>0){
      PagesList = <Pages total={opinionData.response.total} numElem={opinionData.response.result.length} perPhase={opinionData.response.perPhase}  setPhase= {this.setPhase} auth={this.props.auth} list="opinion" origen={this.props.origen} />
    }
    if(typeof this.state.data !== 'undefined'){
      OpinionList = opinionData.response.result;
      from = this.state.total - ( this.state.acumulate+this.state.phase*this.state.perPhase ) ;
      to = this.state.total - ( this.state.acumulate+this.state.phase*this.state.perPhase ) - OpinionList.length + 1;
    }else{
      OpinionList  = [];
    }
    return (
      <div className='opinion' >
        <div className='row'>
          <div className='col-xs-12 col-md-6'>
            <div className='opinion_count' >{opinionData.response.total} {opinionData.response.total === 1 ? this.translate('opinion') : this.translate('opinions')}</div>
            <div className={!OpinionList.length ? 'hide' : 'opinion_showing' }  >{this.translate('opinion.from')} { from } {this.translate('opinion.to')}  { to } </div>
          </div>
          <div className='col-xs-12 col-md-6'>
            <div className='opinion_advice' >{typeof this.state.advice !=='undefined' ? this.state.advice : ''}<a href={'emailto:'+this.state.adviceEmail} className='opinion_advice_email' >{this.state.adviceEmail}</a></div>
          </div>
        </div>
        <div className='row' >
          <div className='col-xs-12 col-md-3'>
            <div className='opinion_author' >
              <div className={this.props.auth.isAuthenticated ? 'opinion_author_avatar' : 'hide' }  style={ 'background-image:url("' + owner.avatar + '")'}></div>
              <div className='opinion_author_data'>
                {/*<div className='opinion_author_data_name' >{p.author.name}</div>*/}
                <div className='opinion_author_data_name' >{this.props.auth.isAuthenticated ? owner.nickName : this.translate('opinion.you')}</div>
                <div className='opinion_author_data_date'>{this.translate('opinion.today')}</div>
              </div>
              <div className='opinion_author_deco'>
                <span class="icon-chevron-up_2"></span>
              </div>
              <div className='opinion_author_deco_responsive'><span class="icon-chevron-up_2"></span></div>
            </div>
          </div>
          <div className='col-xs-12 col-md-9'  >
            <div className='opinion_text_me' >
              <div className='opinion_text_container' ><textArea id="comment"   onkeyup={(evt) => this.handleChange(evt)} value={this.state.comment} placeholder={this.translate('opinion.let')} /></div>
            <div className={'opinion_button ' + this.state.deactive} onClick={this.saveComment} >{this.translate('toComment')}</div>
            </div>
          </div>
        </div>
        {OpinionList.map(( p , index) => {
            {/*var avatar = { 'background':'url('+p.author.avatar+')'};*/}
            var avatar = p.avatar;
            var date = p.date.replace(/ /g,"T");
            return (
              <div className='row' >
                <div className='col-xs-12 col-md-3'>
                  <div className='opinion_author' >
                    <div className='opinion_author_avatar'  style={ 'background-image:url("' + ( owner.id == p.client_id ? owner.avatar : avatar ) + '")'}></div>
                    <div className='opinion_author_data'>
                      {/*<div className='opinion_author_data_name' >{p.author.name}</div>*/}
                      <div className='opinion_author_data_name' >{p.nickname}</div>
                      <div className='opinion_author_data_date'>{ (new Date(date)).toLocaleDateString() } {new Date(date).getHours()}:{new Date(date).getMinutes()}</div>
                    </div>
                    <div className='opinion_author_deco'>
                      <span class="icon-chevron-up_2"></span>
                    </div>
                    <div className='opinion_author_deco_responsive'><span class="icon-chevron-up_2"></span></div>
                  </div>
                </div>
                <div className='col-xs-12 col-md-9'>
                  <div className='opinion_text' >
                    <div className='opinion_text_literals' >
                      <div>#{ this.state.total - ( index+this.state.acumulate+this.state.phase*this.state.perPhase ) }</div>
                      <div>{p.comment}</div>
                    </div>
                    {
                      owner.id == p.client_id
                        ? <div className="opinion_options_container" >
                            <div className='opinion_button' onClick={(comment) => this.deleteComment(p.id)} >{this.translate('opinion.delete')}</div>
                            {/*<div className='opinion_button' >{this.translate('opinion.modify')}</div>*/}
                          </div>
                        : ''
                    }
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

Opinion.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Opinion);
export default Opinion;