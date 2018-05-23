import React from 'react'
import { Modal, API } from '../../services/Rest.js'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import Claim from '../../blocks/Claim/Claim.js'
import Download from '../../blocks/Download/Download.js'
import Utils from '../../utils/Utils.js'
import EpisodeSingleList from '../../components/Episode/EpisodeSingleList/EpisodeSingleList.js'
import List_web from '../../components/Lists/List_web.js'
import './Lists.scss'

const listEmpty ={
  setEmpty(_elem){
    var elem = document.querySelector('#'+this.lists[_elem]);
    elem 
    ? (
      elem.style.display = 'none' ,
      this.listsStatus[_elem] = false,
      this.noLists()
    )
    : null;
  },
  show(_elem){
    var elem = document.querySelector('#'+this.lists[_elem]);
    elem 
    ? (
      elem.style.display = 'initial' ,
      this.listsStatus[_elem] = true,
      this.noLists()
    )
    : null;
  },
  lists:{
    'laterepisode':'laterEpisodes',
    'subscribepodcast':'subscribedPodcasts',
    'favpodcast':'favPodcasts',
    'favepisode':'favEpisodes',
    'likepodcast':'likePodcasts',
    'likeepisode':'likeEpisodes',
    'listenedepisode':'listenedEpisodes'
  },
  listsInit:{
    'laterepisode':false,
    'subscribepodcast':false,
    'favpodcast':false,
    'favepisode':false,
    'likepodcast':false,
    'likeepisode':false,
    'listenedepisode':false
  },
  listsStatus:{
    'laterepisode':false,
    'subscribepodcast':false,
    'favpodcast':false,
    'favepisode':false,
    'likepodcast':false,
    'likeepisode':false,
    'listenedepisode':false
  },
  noLists(){
    var any = false;
    var allInit = true;
    for( var j in this.listsInit){
      !this.listsInit[j]
      ? allInit = false
      : null
    }
    for( var j in this.listsStatus){
      this.listsStatus[j]
      ? any = true
      : null
    }
    var emptyLists = document.querySelector('#allEmpty');
    !allInit
    ? emptyLists.style.display ='none'
    : any && emptyLists
      ? emptyLists.style.display ='none'
      : emptyLists.style.display ='initial'
  }
}

class Lists extends React.Component {
  constructor(props) {
    super(props);
    typeof props.location !== 'undefined'
    ? localStorage.setItem('lastState',props.location.pathname)
    : null;
    this.state = {
      'data':[ ]
    }
    this.handleResize = this.handleResize.bind(this);
  }
  onSuccess = (_response) => {
    Utils.scrollToTop(300);
    _response.status === 'successfull'
    ? this.setState ({
        'data':_response.data,
      })
    : this.setState({
        isOpen: true,
        showedMsg: 'lists.' + _response.reason
    });
  }
  onError = (_response, _error) =>{
    this.setState({
          isOpen: true,
          showedMsg: _error
      });
  }
  componentDidMount(){
    Utils.scrollToTop(300);
    window.addEventListener('resize', this.handleResize);
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
    window.spinner.className ='hide';
    
  }
  handleResize() {
    this.setState({
      'style':{
        'margin-top':document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetHeight + 'px' : '0'
      }
    })
  }
  componentWillUnmount() {
    for( var j in listEmpty.listsInit){
      listEmpty.listsInit[j] = false;
    }
    window.removeEventListener('resize', this.handleResize);
  }
  render() {
    let ClaimDiv;
    this.props.auth.typeUser !== 'premium'
    ? ClaimDiv = <div className="col-xs-12 col-sm-4" >
                <Download mini="true" />
                <div id='right1' >
                  
                </div>
                <Claim />
              </div>
    : ClaimDiv = '';
    return (
      <div className='lists' style={this.state.style} >
        <div class="row">
          <div className={this.props.auth.typeUser !=='premium' ? "col-xs-12 col-sm-8" : "col-xs-12" } >
            <h1 className="lists_rot" >{this.translate('blocks.listsBasic')}</h1>
            {/*<Link to='/lists/favourites' ><div className="neutralPB_bordered">A favoritos</div></Link>
            <Link to='/lists/later' ><div className="neutralPB_bordered">A Escuchar más tarde</div></Link>
            <Link to='/lists/subscribes' ><div className="neutralPB_bordered">A Subscritos</div></Link>
            <Link to='/lists/like' ><div className="neutralPB_bordered">A me gustan</div></Link>
            <Link to='/lists/listened' ><div className="neutralPB_bordered">A Escuchados</div></Link>*/}
            <div id="allEmpty" style="display:none" >{this.translate('user.noLists')}</div>
            <div id='laterEpisodes' >
              <h1>{this.translate('user.toLater').toUpperCase()}</h1>
              <div>
                <EpisodeSingleList initplayer={this.props.initplayer} destiny='later' restrict='true' />
                <List_web list="later" item="episode" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' listEmpty={listEmpty} />
              </div>
            </div>
            <div id='subscribedPodcasts' >
              <h1>{this.translate('podcast.subscribed').toUpperCase()} A {this.translate('menu.podcast').toUpperCase()}</h1>
              <div>
                <EpisodeSingleList initplayer={this.props.initplayer} destiny='subscribes' restrict='true' />
                <List_web list="subscribe" item="podcast" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' listEmpty={listEmpty} />
              </div>
            </div>
            <div id='favPodcasts' >
              <h1>{this.translate('menu.podcast').toUpperCase()} {this.translate('user.favourites').toUpperCase()}</h1>
              <div>
                <EpisodeSingleList initplayer={this.props.initplayer} destiny='favourites' restrict='true' />
                <List_web list="fav" item="podcast" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' listEmpty={listEmpty} />
              </div>
            </div>
            <div id='favEpisodes' >
              <h1>{this.translate('content.episodes').toUpperCase()} {this.translate('user.favourites').toUpperCase()}</h1>
              <div>
                <EpisodeSingleList initplayer={this.props.initplayer} destiny='favourites' restrict='true' />
                <List_web list="fav" item="episode" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' listEmpty={listEmpty} />
              </div>
            </div>
            <div id='likePodcasts' >
              <h1>{this.translate('podcast.liked').toUpperCase()}</h1>
              <div>
                <EpisodeSingleList initplayer={this.props.initplayer} destiny='like' restrict='true' />
                <List_web list="like" item="podcast" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' listEmpty={listEmpty} />
              </div>
            </div>
            <div id='likeEpisodes' >
              <h1>{this.translate('episodes.Liked').toUpperCase()}</h1>
              <div>
                <EpisodeSingleList initplayer={this.props.initplayer} destiny='like' restrict='true' />
                <List_web list="like" item="episode" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' listEmpty={listEmpty} />
              </div>
            </div>
            <div id='listenedEpisodes' >
              <h1>{this.translate('episodes.Listened').toUpperCase()}</h1>
              <div>
                <EpisodeSingleList initplayer={this.props.initplayer} destiny='listened' restrict='true' />
                <List_web list="listened" item="episode" auth={this.props.auth} initplayer={this.props.initplayer} restrict='4' listEmpty={listEmpty} />
              </div>
            </div>
          </div>
           {ClaimDiv} 
        </div>
        {/*<Link to='/lists/downloads' ><div className="neutralPB_bordered">A Downloads</div></Link>
        <Link to='/lists/shared' ><div className="neutralPB_bordered">A Compartidos</div></Link>*/}
        <Modal show={this.state.isOpen} onClose={this.toggleModal}  >
          {this.translate(this.state.showedMsg)}
        </Modal>
      </div>
    );
  }
}

Lists.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Lists);
export default Lists;