import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import { Modal, API } from '../../services/Rest.js'
import Comment from './Comment.js'
import Date from './Date.js'
import Played from './Played.js'
import Like from './Like.js'
import Utils from '../../utils/Utils.js'
import './Stats.scss'

class Stats extends React.Component {
  constructor(props) {
    super(props);
    console.log('props stats');
    console.log(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.saveToLike = this.saveToLike.bind(this);
    this.onSuccessLike = this.onSuccessLike.bind(this);
  }
  clickHandler(event){
    event.stopPropagation();
    this.props.auth.isAuthenticated
    ? this.saveToLike()
    : localStorage.getItem('app')
      ? null
      : (
        localStorage.setItem('scrollY', window.scrollY),
        this.props.auth.required(this.saveToLike)
        )
  }
  saveToLike(){
    window.setSpinner(),//,
    this.setState({
      'refreshing':true
    })
    this.props.data.isLiked
    ? API.action('saveToList', { 'id_item' : this.props.data.id , 'type_item':this.props.origen, 'list':'like', 'value':false }, this.onSuccessLike, this.onError, 'GET', false, true)
    : API.action('saveToList', { 'id_item' : this.props.data.id , 'type_item':this.props.origen, 'list':'like', 'value':true }, this.onSuccessLike, this.onError, 'GET', false, true)
  }
  onSuccessLike(){
    this.props.data.isLiked = !this.props.data.isLiked;
    this.props.data.isLiked
    ? this.props.data.info.likes++
    : this.props.data.info.likes--;
    this.setState({
      'refreshing':false
    })
    localStorage.getItem('scrollY')
    ? localStorage.removeItem('scrollY')
    :null
  }
  render() {
    return (
        <div className="item_stats mt25" >
          {
            this.props.origen === 'channel'
            ? (
                <div className="item_stats_container" >
                  <div class="item_stats_container_elem" >
                    <Comment num={this.props.data.info.comments} />
                  </div>
                </div>
              )
            : this.props.origen === 'podcast'
              ? (
                  <div className="item_stats_container">
                    <div class="item_stats_container_elem"  onClick= { (event) => this.clickHandler(event)}  >
                     <Like data={this.props.data} />
                    </div>
                    <div class="item_stats_container_elem" >
                      <Comment num={this.props.data.info.comments} />
                    </div>
                    <div class="item_stats_container_elem" >
                      <Date num={Utils.statsDate(this.props.data.date)} />
                    {/*<Date num={this.props.data.date.split(' ')[0].split('-').reverse().join('/')} />*/}
                    </div>
                    <div class="item_stats_container_elem" >
                      <Played num={this.props.data.listeneds} />
                    </div>
                  </div>
                )
              : (
                  <div className="item_stats_container">
                    <div class="item_stats_container_elem" onClick= { (event) => this.clickHandler(event)}  >
                      <Like data={this.props.data} />
                    </div>
                    <div class="item_stats_container_elem" >
                      <Comment num={this.props.data.info.comments} />
                    </div>
                    <div class="item_stats_container_elem" >
                      <Date num={Utils.statsDate(this.props.data.date)} />
                      {/*<Date num={this.props.data.date.split(' ')[0].split('-').reverse().join('/')} />*/}
                    </div>
                    <div class="item_stats_container_elem" >
                      <Played num={this.props.data.info.listeneds} />
                    </div>
                  </div>
                )
          }
        </div>
    )
  }
}
Stats.propTypes = {
  //who: React.PropTypes.string.isRequired,
};
// Returns nothing because it mutates the class
TranslatedComponent(Stats);
export default Stats;