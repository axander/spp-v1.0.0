import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import ChannelMenuPB from './ChannelMenuPB.js'
import PlayerApp from '../Player/PlayerApp/PlayerApp.js'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import { Modal, API } from '../../services/Rest.js'
import Lists from '../../utils/Lists.js'
import later from '../../assets/images/later.png';
import fav from '../../assets/images/fav.png';
import share from '../../assets/images/share.png';
import ListSchemma from '../../components/Lists/ListSchemma.js'
import './channelMenu.scss'
// The Header creates links that can be used to navigate
// between routes.


class ChannelMenu extends React.Component {
	constructor(props) {
        super(props);
         console.log('props');
    	console.log(props);
       
        this.state = {
        	'show': '',
        	'showpodcast':'',
        	'showepisode':'',
        	'state':'channel',
        	'toogle':false,
        	'data':[],
        	'datapodcast':[],
        	'dataepisode':[],
        	'channel':'',
        	'podcast':'',
        	'episode':'',
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.clickHandlerChannel = this.clickHandlerChannel.bind(this);
        this.clickHandlerpodcast = this.clickHandlerpodcast.bind(this);
        this.clickHandlerepisode = this.clickHandlerepisode.bind(this);
        this.clickHandlerChannelPB = this.clickHandlerChannelPB.bind(this);
        this.backChannel = this.backChannel.bind(this);
        this.backpodcast = this.backpodcast.bind(this);
        this.backepisode = this.backepisode.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.forwardpodcast = this.forwardpodcast.bind(this);
        this.forwardepisode = this.forwardepisode.bind(this);
        this.forwardepisodePlayer = this.forwardepisodePlayer.bind(this);
        this.showPlayer = this.showPlayer.bind(this);

        this.clickHandlerLater = this.clickHandlerLater.bind(this);
        this.clickHandlerFav = this.clickHandlerFav.bind(this);
        this.clickHandlerShare = this.clickHandlerShare.bind(this);
        this.setSchemmaFav = this.setSchemmaFav.bind(this);
	    this.setSchemmaLater = this.setSchemmaLater.bind(this);
	    this.setSchemmaShare = this.setSchemmaShare.bind(this);

    }


	clickHandler(event){
		switch(this.state.state){
			case 'channel':
				if(!this.state.toogle || this.state.show === '' ){
					this.state.toogle = true;
					this.setState({
						'data':JSON.parse(localStorage.getItem('channels')),
					    'show': 'showContents',
					    'channel':localStorage.getItem('lastChannel')
					}),
					document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
				}else if(this.state.toogle ){
					this.state.toogle = false;
					this.setState({
					    'show': ''
					});
					document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
				}
			break;
			case 'podcast':
				if(!this.state.toogle || this.state.showpodcast === '' ){
					this.state.toogle = true
					this.setState({
						'datapodcast':JSON.parse(localStorage.getItem('podcast')),
					    'showpodcast': 'showContents',
					    'podcast':localStorage.getItem('lastpodcast')
					}),
					document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
				}else if(this.state.toogle ){
					this.state.toogle = false;
					this.setState({
					    'showpodcast': ''
					});
					document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
				}
			break;
			case 'episode':
				if(!this.state.toogle || this.state.showepisode === '' ){
					this.state.toogle = true
					this.setState({
						'dataepisode':JSON.parse(localStorage.getItem('episode')),
					    'showepisode': 'showContents',
					    'episode':localStorage.getItem('lastepisode')
					}),
					document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
				}else if(this.state.toogle ){
					this.state.toogle = false;
					this.setState({
					    'showepisode': ''
					});
					document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
				}
			break;
			/*case 'episodePlayer':
				if(!this.state.toogle || this.state.showepisodePlayer === '' ){
					this.state.toogle = true
					this.setState({
					    'showepisodePlayer': 'showContents',
					}),
					document.getElementById('channelMenuPB').addEventListener('click', this.handleClickOutside, true)
				}else if(this.state.toogle ){
					this.state.toogle = false;
					this.setState({
					    'showepisodePlayer': ''
					});
					document.getElementById('channelMenuPB').removeEventListener('click', this.handleClickOutside, true)
				}
			break;*/
			default:
			break;
		}
    }
    clickHandlerChannelPB(event){
    	if(this.state.state === 'episodePlayer'){
    		if(this.state.showepisodePlayer === '' ){
				this.state.toogle = true
				this.setState({
				    'showepisodePlayer': 'showContents',
				});
			}else{
				this.state.toogle = false;
				this.setState({
				    'showepisodePlayer': ''
				});
			}
    	}
    }
    clickHandlerChannel(event, _name){
    	localStorage.setItem('lastChannelName', _name);
		typeof localStorage.getItem('podcast')!=='undefined' && localStorage.getItem('podcast') && localStorage.getItem('lastChannel') === event.target.id
	    ? ( this.setState ({
		      	'toogle':false,
		        'datapodcast':JSON.parse(localStorage.getItem('podcast')),
		        'show': '',
		        'showpodcast': 'showContents',
		        'state':'podcast'
		      }),
	    	document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
	      )
	    : ( 
	      localStorage.setItem('lastChannel',event.target.id ),
	      this.state.channel = event.target.id,
		  this.state.podcast = '',
		  this.state.episode = '',
		  localStorage.removeItem('lastpodcast'),
		  localStorage.removeItem('lastepisode'),
		  localStorage.removeItem('podcast'),
		  localStorage.removeItem('episode'),
	      window.setSpinner(),
	      API.action('getListPod' + this.state.channel, { 'channel' : event.target.id }, this.onSuccesspodcast, this.onError, 'GET')
	      )
	    ;
    }
    clickHandlerpodcast(event, _name){
    	localStorage.setItem('lastpodcastName', JSON.stringify(_name));
    	typeof localStorage.getItem('episode')!=='undefined' && localStorage.getItem('episode') && localStorage.getItem('lastpodcast') === event.target.id
    	? ( this.setState ({
		      	'toogle':false,
		        'dataepisode':JSON.parse(localStorage.getItem('episode')),
		        'show': '',
		        'showpodcast': '',
		        'showepisode': 'showContents',
		        'state':'episode'
		    }),
	    	document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
	      )
	    : ( 
	      localStorage.setItem('lastpodcast',event.target.id ),
	      this.state.podcast = event.target.id,
		  this.state.episode = '',
		  localStorage.removeItem('lastepisode'),
		  localStorage.removeItem('episode'),
	      window.setSpinner(),
	      API.action('getListEpi' + this.state.podcast, { 'podcast' : event.target.id }, this.onSuccessepisode, this.onError, 'GET')
	      )
	    ;
    }
    clickHandlerepisode(event, _source, _id, _name, _episodeObject){
    	console.log(_name);
    	this.setState ({
	      	'toogle':false,
	        'show': '',
	        'showpodcast': '',
	        'showepisode': '',
	        'showepisodePlayer': 'showContents',
	        'episode': event.target.id,
	        'state':'episodePlayer'
		});
		document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
		this.props.initplayer.play(_source, _id, _name, _episodeObject);
    }
    showPlayer(event){
    	this.setState ({
	      	'toogle':false,
	        'show': '',
	        'showpodcast': '',
	        'showepisode': '',
	        'showepisodePlayer': 'showContents',
	        'state':'episodePlayer'
		});
		document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
    }
    backChannel(event){
		this.setState({
			'state':'channel',
			'toogle':false,
		    'show': '',
		    'showpodcast': ''
		 });
    }
    backpodcast(event){
		this.setState({
			'state':'podcast',
			'toogle':false,
		    'show': '',
		    'showpodcast': 'showContents',
		    'showepisode': ''
		 });
    }
    backepisode(event){
		this.setState({
			'state':'episode',
			'toogle':false,
			'show': '',
		    'showpodcast': '',
	        'showepisode': 'showContents',
	        'showepisodePlayer': ''
		 });
		document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
    }
    forwardpodcast(event){
    	typeof localStorage.getItem('podcast')!=='undefined'  && localStorage.getItem('podcast')
    	? this.setState({
			'state':'podcast',
			'toogle':false,
		    'show': '',
		    'showpodcast': 'showContents',
		    'datapodcast':JSON.parse(localStorage.getItem('podcast'))
		 })
    	: this.setState({
			'state':'podcast',
			'toogle':false,
		    'show': '',
		    'showpodcast': 'showContents',
		 });
    }
    forwardepisode(event){
		this.setState({
			'state':'episode',
			'toogle':false,
		    'show': '',
		    'showpodcast': '',
		    'showepisode':'showContents'
		 });
    }
    forwardepisodePlayer(event){
		this.setState({
			'state':'episodePlayer',
			'toogle':false,
		    'show': '',
		    'showpodcast': '',
		    'showepisode':'',
		    'showepisodePlayer': 'showContents'
		 });
    }
    setSchemmaLater(){
    	var what = this.state.state
    	this.state.state === 'episodePlayer'
    	? what = 'episode'
    	: null;
	    this.props.initSchemma.setSchemma = Lists.saveToList(what,'later',this.state.itemObject.id);
	    this.props.initSchemma.show(what,'later',this.state.itemObject);
	  }
    clickHandlerLater(event, _itemObject){
		typeof _itemObject === 'string'
    	? _itemObject = JSON.parse(_itemObject)
    	:null;
    	event.stopPropagation();
    	this.state.state === 'episodePlayer'
    	? this.clickHandlerChannelPB()
    	: this.clickHandler();
	    this.state.itemObject = _itemObject
	    this.props.auth.isAuthenticated
	    ? this.setSchemmaLater()
	    : (
	      localStorage.setItem('savingList',true),
	      localStorage.getItem('app')
	      ? (
	          this.props.auth.afterRequiredApp = this.setSchemmaLater,
	          window.location.href = './#/login'
	        )
	      : this.props.auth.required(this.setSchemmaLater)
	    )
    }
    setSchemmaFav(){
    	var what = this.state.state;
    	this.state.state === 'episodePlayer'
    	? what = 'episode'
    	: null;
	    this.props.initSchemma.setSchemma = Lists.saveToList(what,'fav',this.state.itemObject.id);
	    this.props.initSchemma.show(what,'fav',this.state.itemObject);
	  }
    clickHandlerFav(event, _itemObject){
    	typeof _itemObject === 'string'
    	? _itemObject = JSON.parse(_itemObject)
    	:null;
    	event.stopPropagation();
    	this.state.state === 'episodePlayer'
    	? this.clickHandlerChannelPB()
    	: this.clickHandler();
	    this.state.itemObject = _itemObject
	    this.props.auth.isAuthenticated
	    ? this.setSchemmaFav()
	    : (
	      localStorage.setItem('savingList',true),
	      localStorage.getItem('app')
	      ? (
	          this.props.auth.afterRequiredApp = this.setSchemmaFav,
	          window.location.href = './#/login'
	        )
	      : this.props.auth.required(this.setSchemmaFav)
	    )
    }
    setSchemmaShare(){
    	var what = this.state.state
    	this.state.state === 'episodePlayer'
    	? what = 'episode'
    	: null;
	    this.props.initSchemma.setSchemma = Lists.saveToList(what,'share',this.state.itemObject.id);
	    this.props.initSchemma.show(what,'share',this.state.itemObject);
	  }
    clickHandlerShare(event, _itemObject){
		typeof _itemObject === 'string'
    	? _itemObject = JSON.parse(_itemObject)
    	:null;
    	event.stopPropagation();
    	this.state.state === 'episodePlayer'
    	? this.clickHandlerChannelPB()
    	: this.clickHandler();
	    this.state.itemObject = _itemObject
	    this.props.auth.isAuthenticated
	    ? this.setSchemmaShare()
	    : (
	      localStorage.setItem('savingList',true),
	      localStorage.getItem('app')
	      ? (
	          this.props.auth.afterRequiredApp = this.setSchemmaShare,
	          window.location.href = './#/login'
	        )
	      : this.props.auth.required(this.setSchemmaShare)
	    )
    }
    componentDidMount() {
	}
	componentWillUnmount() {
		document.getElementById('root').removeEventListener('click', this.handleClickOutside, true);
	}

	handleClickOutside(event) {
	    const domNode = ReactDOM.findDOMNode(this);
	    if (!domNode || !domNode.contains(event.target)) {
	    	switch(this.state.state){
				case 'channels':
					this.setState({
					    'show': ''
					 });
				break;
				case 'podcasts':
					this.setState({
					    'showpodcast': ''
					 })
				break;
				case 'episodes':
					this.setState({
					    'showepisode': ''
					 });
				break;
				default:
				break;
			}
	    }
	    event.target.id !== 'later' && event.target.id !== 'fav' && event.target.id !== 'share'
	    ? document.getElementById('root').removeEventListener('click', this.handleClickOutside, true)
	    : null;
	}
	onSuccess = (_response) => {
	    _response.status === 'successfull'
	    ? ( 
	      this.setState ({
	        'data':_response.data
	      }),
	      localStorage.setItem('channels', JSON.stringify(_response.data))
	    )
	    : this.setState({
	        isOpen: true,
	        showedMsg: 'channels.' + _response.reason
	    });
	}
	onSuccesspodcast = (_response) => {
	    _response.status === 'successfull'
	    ? ( 
	      this.setState ({
	      	'toogle':true,
	        'datapodcast':_response.data,
	        'show': '',
	        'showpodcast': 'showContents',
	        'state':'podcast'
	      }),
	      localStorage.setItem('podcast', JSON.stringify(_response.data))
	    )
	    : this.setState({
	        isOpen: true,
	        showedMsg: 'podcast.' + _response.reason
	    });
	    document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
	}
	onSuccessepisode = (_response) => {
	    _response.status === 'successfull'
	    ? ( 
	      this.setState ({
	      	'toogle':true,
	        'dataepisode':_response.data,
	        'show': '',
	        'showpodcast': '',
	        'showepisode': 'showContents',
	        'state':'episode'
	      }),
	      localStorage.setItem('episode', JSON.stringify(_response.data))
	    )
	    : this.setState({
	        isOpen: true,
	        showedMsg: 'episode.' + _response.reason
	    });
	    document.getElementById('root').addEventListener('click', this.handleClickOutside, true)
	}
	onError = (_response, _error) =>{
	    this.setState({
	        isOpen: true,
	        showedMsg: _error
	    });
	}
	toggleModal = () => {
	    this.setState({
	        isOpen: !this.state.isOpen
	    });
	}
	componentDidMount(){
	    typeof localStorage.getItem('channels')!=='undefined'  && localStorage.getItem('channels')
	    ? this.setState ({
	        'data':JSON.parse(localStorage.getItem('channels')),
	        'channel':localStorage.getItem('lastChannel')
	      })
	    : ( 
	      window.setSpinner(),
	      this.props.auth.isAuthenticated
	      ? API.action('getListChan', {}, this.onSuccess, this.onError, 'get', false, true)
	      : API.action('getListChanMarketing', {}, this.onSuccess, this.onError, 'get', false, true)
	      )
	}
	/*
    <div class="col-xs-6">
      <div className="desc">
        {p.desc[localStorage.getItem('language')]}
      </div>
    </div>
    */
    /*
	<div class="col-xs-6">
	  <div className="desc">
	    {p.desc[localStorage.getItem('language')]}
	  </div>
	</div>
	*/
	/*
    <div class="col-xs-6">
      <div className="desc">
        {p.desc[localStorage.getItem('language')]}
      </div>
    </div>
	*/
  	render() {
  		var cms = JSON.parse(localStorage.getItem('config')).cms;
	  	return(
	  		<div className="lateralChannelMenu" onClick={ this.clickHandler } >
	  			<div onClick={ this.clickHandlerChannelPB } >
		  			<ChannelMenuPB />
		  		</div>
		  		<channelOptions id="menuContainer" className={this.state.show } >
				    <nav>
				    	<div className='contentStateRot' >{this.translate('menu.channel')}</div>
				    	<div className={this.state.channel !== '' ? 'forwardContentPB' : 'hide'}  onClick={this.forwardpodcast} >{this.translate('menu.podcast')}⇨</div>
				    	<div className="scrollCont" >
				    		<div className="scrollableCont" >
						            {
						            this.state.data.map(p => (
						            	<div className='row' >
								            <div id={p.id} className={this.state.channel === p.id ? 'item single_item contentSelected' : 'item single_item ' } style={ 'background-image:url("' + cms + p.image + '")' } onClick={ (event, _name) => this.clickHandlerChannel(event, p.name)} >
								                <div className="rot">
								                    {p.name}
								                </div>
							                    <div className="single_desc">
							                        &#10095;
							                    </div>
							                </div>
						                    <div className="options" >
						                      <div><div><img id='later' src={later} alt="later" onClick={ (event, id) => this.clickHandlerLater(event, p)} /></div></div>
						                      <div><div><img id='fav' src={fav} alt="fav" onClick={ (event, id) => this.clickHandlerFav(event, p)} /></div></div>
						                      <div><div><img id='share' src={share} alt="share" onClick={ (event, id) => this.clickHandlerShare(event, p)} /></div></div>
						                  	</div>
								        </div>
						            ))
						          }
						    </div>
					    </div>
				    </nav>
				</channelOptions>
				<podcastOptions id="menuContainer" className={this.state.showpodcast} >
				    <nav>
				    	<div>
				    		<div className='contentStateRot' >{this.translate('menu.podcast')+':'+this.translate('channel')+( localStorage.getItem('lastChannelName') ? localStorage.getItem('lastChannelName') : '' )}</div>
				    		<div className={this.state.podcast !== '' ? 'forwardContentPB' : 'hide'} onClick={this.forwardepisode} >{this.translate('menu.episode')}⇨</div>
				    		<div className='backContentPB' onClick={this.backChannel} >⇦{this.translate('menu.channel')}</div>
				    	</div>
				    	<div className="scrollCont" >
				    		<div className="scrollableCont" >
						            {
						            this.state.datapodcast.map(p => (
						              <div className='row' >
						                <div id={p.id} className={this.state.podcast === p.id ? 'item single_item contentSelected' : 'item single_item ' }  style={ 'background-image:url("' + p.image + '")' } onClick={ (event, _name) => this.clickHandlerpodcast(event, p.name)}>
							                <div className="rot">
							                    {p.name}
							                </div>
							                <div className="single_desc">
					                          &#10095;
					                        </div>
			                      		</div>
					                    <div className="options" >
					                      	<div><div><img id='later' src={later} alt="later" onClick={ (event, id) => this.clickHandlerLater(event, p)} /></div></div>
						                    <div><div><img id='fav' src={fav} alt="fav" onClick={ (event, id) => this.clickHandlerFav(event, p)} /></div></div>
						                    <div><div><img id='share' src={share} alt="share" onClick={ (event, id) => this.clickHandlerShare(event, p)} /></div></div>
					                  	</div>
						              </div>
						            ))
						          }
						    </div>
					    </div>
				    </nav>
				</podcastOptions>
				<episodeOptions id="menuContainer" className={this.state.showepisode} >
				    <nav>
				    	<div>
				    		<div className='contentStateRot' >{this.translate('menu.episode')+':'+this.translate('podcast')+( localStorage.getItem('lastpodcastName') ? localStorage.getItem('lastpodcastName') : '' )}</div>
				    		<div className={this.state.episode !== '' ? 'forwardContentPB' : 'hide'} onClick={this.forwardepisodePlayer} >{this.translate('menu.episodePlayer')}⇨</div>
				    		<div className='backContentPB' onClick={this.backpodcast} >⇦{this.translate('menu.podcast')}</div>
				    	</div>
				    	<div className="scrollCont" >
				    		<div className="scrollableCont" >
						            {
						            this.state.dataepisode.map(p => (
						              	<div className='row' >
								            <div id={p.id} className={this.state.episode === p.id ? 'item single_item contentSelected' : 'item single_item ' } style={ 'background-image:url("' + p.image + '")' } onClick={ (event, _source, _id, _name, _episodeObject) => this.clickHandlerepisode(event, p.file, p.id, p.name, p)} >
								                <div className="rot">
								                    {p.name}
								                </div>
							                    <div className="single_desc">
							                        &#10095;
							                    </div>
							                </div>
						                    <div className="options" >
						                      	<div><div><img id='later' src={later} alt="later" onClick={ (event, id) => this.clickHandlerLater(event, p)} /></div></div>
						                      	<div><div><img id='fav' src={fav} alt="fav" onClick={ (event, id) => this.clickHandlerFav(event, p)} /></div></div>
						                      	<div><div><img id='share' src={share} alt="share" onClick={ (event, id) => this.clickHandlerShare(event, p)} /></div></div>
						                  	</div>
								        </div>
						            ))
						          }
						    </div>
					    </div>
				    </nav>
				</episodeOptions>
				<episodePlayer id="menuContainer" className={this.state.showepisodePlayer} >
				    <nav>
				    	<div>
				    		<div className='contentStateRot' >{this.translate('episode')+':'+ ( localStorage.getItem('lastepisodeName') ? localStorage.getItem('lastepisodeName') : '' ) }</div>
				    		<div className='forwardContentPB' onClick={ this.clickHandlerChannelPB } >X</div>
				    		<div className='backContentPB' onClick={this.backepisode} >⇦{this.translate('menu.episode')}</div>
				    	</div>
				    	<div className="scrollCont" >
				    		<div className="scrollableCont" >
				    			<PlayerApp initplayer={this.props.initplayer} showplayer={this.showPlayer} />
						    </div>
			    			<div className="options" >
		                      	<div><div><img id='later' src={later} alt="later" onClick={ (event, id) => this.clickHandlerLater(event, localStorage.getItem('episodeInfo') )} /></div></div>
			                    <div><div><img id='fav' src={fav} alt="fav" onClick={ (event, id) => this.clickHandlerFav(event, localStorage.getItem('episodeInfo') )} /></div></div>
			                    <div><div><img id='share' src={share} alt="share" onClick={ (event, id) => this.clickHandlerShare(event, localStorage.getItem('episodeInfo') )} /></div></div>
		                  	</div>
					    </div>
				    </nav>
				    <PlayerApp />
				</episodePlayer>
			</div>
	  	)
	  }
}
ChannelMenu.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(ChannelMenu);
export default ChannelMenu