import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import {API} from '../../services/Rest.js'
import LocalSpinner from '../../blocks/Common/LocalSpinner/LocalSpinner.js'
import LocalError from '../../blocks/Common/LocalError/LocalError.js'
import Pages from '../Pages/Pages.js'
import Utils from '../../utils/Utils.js'
import './Lists_web.scss'

class Lists_web extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      'cms':JSON.parse(localStorage.getItem('config')).cms,
      'init':true,
      'loading':true,
      'error':false,
      'data':[],
      'type':this.props.type,
      'focusItem':0,
      'showDelete': -1,
      'deleted': 0
    }
    this.setPhase = this.setPhase.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.onSuccessDel = this.onSuccessDel.bind(this);
    this.cancelDeleteItem = this.cancelDeleteItem.bind(this);
  }
  onSuccess = (_response) => {
    console.log('getList response');
    console.log(_response);
    //'data': this.props.restrict ? _response.result.slice(0,4) :  _response.result,
    _response.status === 'success'
    ? (
        this.setState({
          'init':false,
          'loading':false,
          'error':false,
          'data': _response.result,
          'total':_response.total,
          'phase':localStorage.getItem('phase_'+this.state.type) || 0,
          'perPhase':_response.perPhase
        }),
        typeof this.props.listEmpty !== 'undefined' && this.props.listEmpty 
        ? this.props.listEmpty.listsInit[this.props.list+this.props.item]= true
        : null
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
  showDeleteItem(position){
      this.setState({
        'showDelete': position
      })
  }
  cancelDeleteItem(){
      this.setState({
        'showDelete': -1
      })
  }
  deleteItem(item, position){
      window.setSpinner();//,
      this.setState({
        'refreshing':true,
        'focusItem':position
      })
      API.action('saveToList', { 'id_item' : item.id , 'type_item':this.props.item, 'list':this.props.list ,'value':false }, this.onSuccessDel, this.onError, 'GET', false, true)
  }
  onSuccessDel(){
    var newData = this.state.data;
    delete newData[this.state.focusItem];
    this.setState({
      'data': newData,
      'refreshing':false,
      'showDelete': -1,
      'deleted':this.state.deleted+1
    })
    !(newData.length - this.state.deleted)
    ? typeof this.props.listEmpty !== 'undefined' && this.props.listEmpty 
      ? this.props.listEmpty.setEmpty(this.props.list+this.props.item)
      : null
    : null;
  }
  onSuccessOrigen = (_response) => {
    _response.status === 'success' || this.state.originType === 'canal'
    ? this.setOrigen(_response)
    : this.setState({
        isOpen: true,
        showedMsg: 'episode.' + _response.reason
    });
  }
  setOrigen(_response){
    console.log(_response);
    switch(this.state.originType){
      case 'canal':
        alert('recuperar position by channel origin info');
        _response.position = 0;
        localStorage.setItem('lastPosition',_response.position % _response.perPhase);//indicates the position
        localStorage.setItem('phase_podcast_'+_response.data.id, Math.trunc(_response.position / _response.perPhase));
        localStorage.setItem('lastChannel',_response.data.id);
        localStorage.setItem('lastChannelLink','/podcast/'+_response.data.id+'/'+_response.data.name);
        localStorage.setItem('lastChannelName',_response.data.name);
        localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response.data));
        localStorage.setItem('phase_opinion_'+_response.data.id, 0);
        window.location.href = './#/episode/'+_response.data.id+'/'+_response.data.name;
      break;
      case 'podcast':
        localStorage.setItem('lastPosition',_response.position % _response.perPhase);//indicates the position
        localStorage.setItem('lastItemDataepisode',JSON.stringify(_response.data.podcast));
        localStorage.setItem('phase_podcast_'+_response.data.podcast.id, Math.trunc(_response.position / _response.perPhase));
        localStorage.setItem('lastpodcast',_response.data.podcast.id);
        localStorage.setItem('lastpodcastName',_response.data.podcast.name);
        localStorage.setItem('lastpodcastLink','/episode/'+_response.data.podcast.id+'/'+_response.data.podcast.name);
        localStorage.setItem('lastChannel',_response.data.channel.id);
        localStorage.setItem('lastChannelLink','/podcast/'+_response.data.channel.id+'/'+_response.data.channel.name);
        localStorage.setItem('lastChannelName',_response.data.channel.name);
        localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response.data.channel));
        localStorage.setItem('phase_opinion_'+_response.data.podcast.id, 0);
        window.location.href = './#/episode/'+_response.data.podcast.id+'/'+_response.data.podcast.name;
      break;
      case 'episode':
        localStorage.setItem('lastItemDatastatic',JSON.stringify(_response.data.episode));
        localStorage.setItem('lastPosition',_response.position % _response.perPhase);//indicates the position
        localStorage.setItem('phase_episode_'+_response.data.episode.id, Math.trunc(_response.position / _response.perPhase));
        localStorage.setItem('lastpodcast',_response.data.podcast.id);
        localStorage.setItem('lastpodcastName',_response.data.podcast.name);
        localStorage.setItem('lastItemDataepisode',JSON.stringify(_response.data.podcast));
        localStorage.setItem('lastpodcastLink','/episode/'+_response.data.podcast.id+'/'+_response.data.podcast.name);
        localStorage.setItem('lastChannel',_response.data.channel.id);
        localStorage.setItem('lastChannelLink','/podcast/'+_response.data.channel.id+'/'+_response.data.channel.name);
        localStorage.setItem('lastChannelName',_response.data.channel.name);
        localStorage.setItem('lastItemDatapodcast',JSON.stringify(_response.data.channel));
        localStorage.setItem('phase_opinion_'+_response.data.podcast.id, 0);
        this.props.initplayer.data = _response.data.episode;
        this.props.initplayer.play(_response.data.episode.file, _response.data.episode.id, _response.data.episode.name, _response.data.episode);
        window.location.href = './#/static/'+_response.data.episode.id+'/'+_response.data.episode.name;
      break;
      default:
      break;
    }
  }
  getOrigen(_p){
    Utils.scrollToTop(300);
    window.setSpinner();
    this.state.originType = this.props.item;
    switch(this.props.item){
      case 'canal':
        API.action('getChannelOrigen', {}, this.onSuccessOrigen, this.onError, 'GET', false, true , { 'param' : _p.slug });
      break;
      case 'podcast':
        API.action('getPodcastOrigen', { 'id' : _p.id }, this.onSuccessOrigen, this.onError, 'GET', false, true);
      break;
      case 'episode':
        API.action('getEpisodeOrigen', { 'id' : _p.id }, this.onSuccessOrigen, this.onError, 'GET', false, true);
      break;
    }
    
  }
  
  componentDidMount(){
      API.action('getList', { 'list':this.props.list, 'type_item':this.props.item, 'phase': localStorage.getItem('phase_'+this.props.type) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
  }
  setPhase(_phase){
    API.action('getList', { 'list':this.state.type, 'type_item':this.props.item, 'phase': localStorage.getItem('phase_'+this.state.type) || 0 }, this.onSuccess, this.onError, 'GET', false, true);
    window.setSpinner();
  }
  render() {
    var lan = localStorage.getItem('language');
    let PagesList;
    if(this.state.total>0){
      PagesList = <Pages total={this.state.total} perPhase={this.state.perPhase} setPhase= {this.setPhase} auth={this.props.auth} list={this.props.type} />
    }
    (!(this.state.data.length - this.state.deleted) || !this.state.data.length ) && typeof this.props.listEmpty !== 'undefined' && this.props.listEmpty 
    ? (
      this.props.listEmpty.setEmpty(this.props.list+this.props.item)
    )
    : (
      typeof this.props.listEmpty !== 'undefined' && this.props.listEmpty
      ? this.props.listEmpty.show(this.props.list+this.props.item) 
      : null
    )
    return (
      <div className='list_web' >
        <div className='listsWebBlock' >
          <div className={!this.state.data.length || !(this.state.data.length - this.state.deleted) ? '':'hide'} >{ this.translate('user.listEmpty')}</div>
          <div>
            {this.state.data.map(( p , index) => {
              var itemGo
              this.props.item !== 'algún tipo'
              ? itemGo = <div className="listsWebBlock_item_play" onClick={() => this.getOrigen(p)} >
                    <div className='listsWebBlock_item_play_PB'>
                      <div className='listsWebBlock_item_play_PB_deco'>
                        {/*<div></div>*/}
                        <span class="icon-play-circle" style="color: rgb(255, 255, 255); border-color: rgb(255, 255, 255) !important;"></span>
                      </div>
                    </div>
                  </div>
              : itemGo = <div className="listsWebBlock_item_play" onClick={() => this.getOrigen(p)} >
                    <div className='listsWebBlock_item_play_PB'>
                      Go
                    </div>
                  </div>
              return (
                <div id={'listsWebBlock_item_' + index} className="listsWebBlock_item" >
                  {itemGo}
                  <div className="listsWebBlock_item_image" onClick={() => this.getOrigen(p)} ><div className="listsWebBlock_item_image_thumb" style={ this.props.item ==='episode' ? 'background-image:url("' + this.state.cms + p.picture + '")' : 'background-image:url("' + this.state.cms + p.image + '")'} ></div></div>
                  <div className="listsWebBlock_item_name" onClick={() => this.getOrigen(p)} >
                    <div className="listsWebBlock_item_name_title" onClick={() => this.getOrigen(p)} >{this.props.item !== 'episode' ? index+1 +'.' : '' } {p.name}</div>
                     <div className="listsWebBlock_item_description" >{p.descripction}</div>
                  </div>
                  {/*<div className="listsWebBlock_item_options" >
                    <div className="listsWebBlock_item_options_deco" >
                      •••
                    </div>
                  </div>*/}
                  <div className="listsWebBlock_item_duration" >{this.props.item === 'episode' ? Utils.hoursMinutesSeconds(p.duration) : ''}</div>
                  <div className="listsWebBlock_item_delete" onClick={(position) => this.showDeleteItem(index)}>
                    <div className='listsWebBlock_item_del_PB'>
                      <div className='listsWebBlock_item_del_PB_deco'>
                        <div>
                          <span class="icon-x" ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={this.state.showDelete === index ? 'list_ask_delete' : 'hide'} >
                    <div class="basicOuter">
                      <div class="basicInner">
                        <div>
                          <div className="list_ask_delete_rot">{this.translate('sure')}</div>
                          <div className="list_ask_delete_cancel" onClick={this.cancelDeleteItem}>{this.translate('cancel')}</div>
                          <div className="list_ask_delete_exec" onClick={(item, position) => this.deleteItem(p, index)} >{this.translate('continue')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/*<div class="row" >
            <div className="col-xs-12" >
              {this.props.restrict ? '' : PagesList}
            </div>
          </div>*/}
          <div className={this.state.loading ? 'spinner':'hide'} ><LocalSpinner /></div>
          <div className={this.state.error ? 'error':'hide'} ><LocalError /></div>
        </div>
      </div>
    );
  }
}

Lists_web.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Lists_web);
export default Lists_web;