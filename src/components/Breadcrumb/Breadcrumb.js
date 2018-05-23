import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Ads from '../../blocks/Ads/Ads.js'
import Slider from '../../blocks/Slider/Slider.js'
import './Breadcrumb.scss'

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        'client':JSON.parse(localStorage.getItem('client')) || null,
        'paths':[],
        'acumulate':[],
        'episodeActive':null
    }
  }
  keepBreadCrumb(){
    /*document.querySelector('.breadcrumb') && document.querySelector('.breadcrumb_container') && window.getComputedStyle(document.querySelector('.breadcrumb_container')).display !== 'none'
    ? window.scrollY > document.querySelector('.breadcrumb').offsetHeight - document.querySelector('.header_web_main').offsetHeight + 20
      ? document.querySelector('.breadcrumb').style.top = window.scrollY - document.querySelector('.breadcrumb').offsetHeight + document.querySelector('.breadcrumb_container').offsetHeight + document.querySelector('.header_web_main').offsetHeight +'px'
      : document.querySelector('.breadcrumb').style.top = ''
    : document.querySelector('.breadcrumb').style.top = '';*/
  }
  componentDidMount(){
    // nonstandard: Chrome, IE, Opera, Safari
    window.addEventListener("scroll", this.keepBreadCrumb, false); 
    // nonstandard: Firefox
    window.addEventListener("DOMMouseScroll", this.keepBreadCrumb, false);
   
  }
  componentWillUpdate(){
    document.querySelector('.breadcrumb').style.top = '';
  }
  componentWillUnmount(){
    // nonstandard: Chrome, IE, Opera, Safari
    window.removeEventListener("scroll", this.keepBreadCrumb, false); 
    // nonstandard: Firefox
    window.removeEventListener("DOMMouseScroll", this.keepBreadCrumb, false);
   
  }
  render() {
    var sequence = this.props.location.pathname.split('/');
    var section = '';
    sequence.shift();
    switch(sequence[0]){
      case 'info':
        this.state.acumulate=[];
        /*this.state.acumulate[0] ={
          'text':this.translate('info'),
          'path':this.props.location.pathname
        }*/
        this.state.acumulate[0] ={
          'text':this.translate('footer.'+sequence[1]),
          'path':this.props.location.pathname
        }
      break;
      case 'search':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('search'),
          'path':this.props.location.pathname
        }
      break;
      case 'register':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('register'),
          'path':this.props.location.pathname
        }
      break;
      case 'profile':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('profile'),
          'path':this.props.location.pathname
        }
      break;
      case 'premium':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('user.toPremium'),
          'path':this.props.location.pathname
        }
      break;
      case 'cancel-premium-process':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('user.toPremium'),
          'path':'/premium'
        }
      break;
      case 'premium-process-ok':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('user.toPremium'),
          'path':'/subscription'
        }
      break;
      case 'recovered':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('register.recoverPwd.rot'),
          'path':this.props.location.pathname
        }
      break;
      case 'promotional':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('user.promotional'),
          'path':this.props.location.pathname
        }
      break;
      case 'deleteAccount':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('profile'),
          'path':'/profile'
        }
        this.state.acumulate[1] ={
          'text':this.translate('user.deleteAccount'),
          'path':this.props.location.pathname
        }
      break;
      case 'lists':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('profile'),
          'path':'/profile'
        }
        this.state.acumulate[1] ={
          'text':this.translate('lists'),
          'path':this.props.location.pathname
        }
        if(typeof sequence[1] !== 'undefined'){
          this.state.acumulate[1] ={
            'text':this.translate('lists'),
            'path':'/lists'
          };
          switch(sequence[1]){
            case 'favourites':
              this.state.acumulate[2] ={
                'text':this.translate('user.favourites'),
                'path':this.props.location.pathname
              }
            break;
            case 'later':
              this.state.acumulate[2] ={
                'text':this.translate('user.later'),
                'path':this.props.location.pathname
              }
            break;
            case 'like':
              this.state.acumulate[2] ={
                'text':this.translate('user.later'),
                'path':this.props.location.pathname
              }
            break;
            case 'listened':
              this.state.acumulate[2] ={
                'text':this.translate('episodes.Listened'),
                'path':this.props.location.pathname
              }
            break;
            case 'shared':
              this.state.acumulate[2] ={
                'text':this.translate('user.shared'),
                'path':this.props.location.pathname
              }
            break;
            case 'subscribes':
              this.state.acumulate[2] ={
                'text':this.translate('user.subscribes'),
                'path':this.props.location.pathname
              }
            break;
            case 'history':
              this.state.acumulate[2] ={
                'text':this.translate('user.history'),
                'path':this.props.location.pathname
              }
            break;
            case 'downloads':
              this.state.acumulate[2] ={
                'text':this.translate('user.downloads'),
                'path':this.props.location.pathname
              }
            break;
            default:

            break;
          }
        }
      break;
      case 'favourites':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('profile'),
          'path':'/profile'
        }
        this.state.acumulate[1] ={
          'text':this.translate('lists'),
          'path':'/lists'
        }
        this.state.acumulate[2] ={
          'text':this.translate('user.favourites'),
          'path':this.props.location.pathname
        }
      break;
      case 'subscription':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('profile'),
          'path':'/profile'
        }
        this.state.acumulate[1] ={
          'text':this.translate('subscription'),
          'path':this.props.location.pathname
        }
      break;
      case 'bills':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('profile'),
          'path':'/profile'
        }
        this.state.acumulate[1] ={
          'text':this.translate('bills'),
          'path':this.props.location.pathname
        }
      break;
      case 'explorar':
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':this.translate('EXPLORE'),
          'path':this.props.location.pathname
        }
        section = 'explore';
      break;
      case 'podcast':
        this.state.acumulate.length <=0
        ? this.state.acumulate[0] ={
            'text':this.translate('EXPLORE'),
            'path':'/explorar'
          }
        : null;
        this.state.acumulate = this.state.acumulate.splice(0,2);
        if(!sequence[2]){
          window.location.href = '/';
        }else{
          this.state.acumulate[1] ={
            'text':sequence[2],
            'path':this.props.location.pathname
          }
        }
      break;
      case 'episode':
        /*this.state.acumulate.length <=0
        ?(*/
          this.state.acumulate[0] ={
            'text':this.translate('EXPLORE'),
            'path':'/explorar'
          };
          this.state.acumulate[1] ={
            'text':localStorage.getItem('lastChannelName'),
            'path':'/podcast/'+localStorage.getItem('lastChannel')+'/'+localStorage.getItem('lastChannelName')
          };
        /*)
        : null;*/
        this.state.acumulate = this.state.acumulate.splice(0,3);
        this.state.acumulate[2] ={
          'text':sequence[2],
          'path':this.props.location.pathname
        }
        if(!sequence[2]){
          window.location.href = '/';
        }else{
          if(sequence.length>4){
            this.state.acumulate.push({
              'text':sequence[4],
              'path':''
            });
            
            if(!this.state.episodeActive){
              window.location.href = window.location.href.substring(0,window.location.href.indexOf(sequence[3])-1);
              this.state.episodeActive = sequence[4];
            }
          }else if(this.state.episodeActive){
            this.state.acumulate.push({
              'text':this.state.episodeActive,
              'path':''
            });
            this.state.episodeActive = null;
          }
        }
        
      break;
      case 'static':

        /*this.state.acumulate.length <=0
        ?(*/
          this.state.acumulate[0] ={
            'text':this.translate('EXPLORE'),
            'path':'/explorar'
          },
          this.state.acumulate[1] ={
            'text':localStorage.getItem('lastChannelName'),
            'path':'/podcast/'+localStorage.getItem('lastChannel')+'/'+localStorage.getItem('lastChannelName')
          },
          this.state.acumulate[2] ={
            'text':localStorage.getItem('lastpodcastName'),
            'path':'/episode/'+localStorage.getItem('lastpodcast')+'/'+localStorage.getItem('lastpodcastName')
          },
          this.state.acumulate[3] ={
            'text':localStorage.getItem('lastepisodeName'),
            'path':''
          }
        /*)
        : null;*/
        this.state.acumulate = this.state.acumulate.splice(0,4);
        this.state.acumulate[3] ={
          'text':sequence[2],
          'path':this.props.location.pathname
        }
      break;
      default:
        this.state.acumulate=[];
        this.state.acumulate[0] ={
          'text':sequence[1],
          'path':this.props.location.pathname
        }
      break;
    }
    this.state.paths = sequence;
    let Ad;
    this.props.auth.isAuthenticated && this.state.client && this.state.client.personalData.type !== 'basic'
    ? Ad = ''
    : Ad = <Ads />;
    let Carousel;
    section === 'explore'
    ? Carousel = <Slider explorer="active" />
    : Carousel = ''
    return (
      <div className='breadcrumb' >
          <div>{Ad}</div>
          <div>{Carousel}</div>
          <div class="breadcrumb_container">
            <Link to={'/'} ><div className='breadcrumb_item' >{this.translate('INIT')}<span className='breadcrumb_item_deco' >❯</span></div></Link>
            {this.state.acumulate.map(( p , index) => {
              return (
                <Link to={p.path} ><div className='breadcrumb_item' >
                  {p.text}<span className={index !== this.state.acumulate.length-1 ? 'breadcrumb_item_deco' : 'hide'} >❯</span>
                </div></Link>
              )
            })}
            
          </div>
      </div>
    );
  }
}

Breadcrumb.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Breadcrumb);
export default Breadcrumb;