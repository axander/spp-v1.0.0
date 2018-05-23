import React from 'react'
import { Link, Route } from 'react-router-dom'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import './Pages.scss'

class Pages extends React.Component {
  constructor(props) {
    super(props);
    var phase = this.returnPhasePerType();
    this.state ={
      'phasePage':5,
      'total':this.props.total,
      'perPhase':this.props.perPhase,
      'phase':phase,
      'phases':[],
      'phaseBefore':phase,
      'acumulate':phase
    }
    this.phases = [];
    this.setPhase = this.setPhase.bind(this);
    this.rewindPages = this.rewindPages.bind(this);
    this.forwardPages = this.forwardPages.bind(this);
    this.fromDots = this.fromDots.bind(this);
  }
  returnPhasePerType(){
    var phase = null;
    switch(this.props.list){
      case 'new':
        phase = parseFloat(localStorage.getItem('phase_'+this.props.list+'_'+this.props.origen )) || 0;
      break;
      case 'opinion':
        phase = parseFloat(localStorage.getItem('phase_'+this.props.list+'_'+this.props.origen )) || 0;
      break;
      case 'channel':
        phase = parseFloat(localStorage.getItem('phase_'+this.props.list)) || 0;
      break;
      case 'podcast':
        phase = parseFloat(localStorage.getItem('phase_'+this.props.list+'_'+ localStorage.getItem('lastChannel'))) || 0;
      break;
      case 'episode':
        phase = parseFloat(localStorage.getItem('phase_'+this.props.list+'_'+ localStorage.getItem('lastpodcast'))) || 0;
      break;
      default:
        phase = parseFloat(localStorage.getItem('phase_'+this.props.list)) || 0;
      break;
    }
    return phase
  }
  setPhase(_phase){
    this.props.auth.hide();
    this.phases[this.state.phaseBefore] = false;
    this.phases[_phase] = true;
    switch(this.props.list){
        case 'new':
          localStorage.setItem('phase_'+this.props.list+'_'+localStorage.getItem('lastNew'), _phase);
        break;
        case 'opinion':
          localStorage.setItem('phase_'+this.props.list+'_'+localStorage.getItem('lastOpinion'), _phase);
        break;
        case 'channel':
          localStorage.setItem('phase_'+this.props.list, _phase);
        break;
        case 'podcast':
          localStorage.setItem('phase_'+this.props.list+'_'+ localStorage.getItem('lastChannel'), _phase);
        break;
        case 'episode':
          localStorage.setItem('phase_'+this.props.list+'_'+ localStorage.getItem('lastpodcast'), _phase);
        break;
        default:
          localStorage.setItem('phase_'+this.props.list, _phase);
        break;
    }
    
    if(_phase>=(this.state.phases.length-1)-this.state.phasePage){
      this.setState({
        'phase':_phase,
        'acumulate':(this.state.phases.length-1)-this.state.phasePage,
        'phases': this.phases,
        'phaseBefore':_phase
      })
    }else{
      this.setState({
        'phase':_phase,
        'acumulate':_phase,
        'phases': this.phases,
        'phaseBefore':_phase
      })
    }
    this.props.setPhase(_phase,true);//second parameter indicate is triggered from pages component
  }
  rewindPages(){
    if(this.state.phase-1>(this.state.phases.length-1)-this.state.phasePage){
      this.setState({
        'phase':this.state.phase-1,
      })
    }else{
      this.setState({
        'acumulate':this.state.phase-1,
        'phase':this.state.phase-1,
      })
    }
    
    this.setPhase(this.state.phase);
  }
  forwardPages(){
    if(this.state.phase-1>(this.state.phases.length-1)-this.state.phasePage){
      this.setState({
        'phase':this.state.phase+1,
      })
    }else{
      this.setState({
        'acumulate':this.state.phase+1,
        'phase':this.state.phase+1,
      })
    }
    
    this.setPhase(this.state.phase);
  }
  fromDots(){
    if(this.state.phase + this.state.phasePage >= this.phases.length-1){
      this.setPhase(this.state.phase - this.state.phasePage);
    }else{
      this.setPhase(this.state.phase + this.state.phasePage);
    }
    
  }
  componentDidMount() {
    // Will execute as normal
    this.phases = Array.apply(null, {length: Math.ceil(this.props.total/this.props.perPhase)}).map(Boolean);
    console.log(this.phases);
    this.setState({
      'phases': this.phases
    })
    this.phases[this.state.phaseBefore] = false;
    var _phase = this.returnPhasePerType();
    this.phases[_phase] = true;
    if(_phase>=(this.state.phases.length-1)-this.state.phasePage){
      this.setState({
        'phase':_phase,
        'acumulate':(this.state.phases.length-1)-this.state.phasePage,
        'phases': this.phases,
        'phaseBefore':_phase
      })
    }else{
      this.setState({
        'phase':_phase,
        'acumulate':_phase,
        'phases': this.phases,
        'phaseBefore':_phase
      })
    }
    //this.setPhase(parseFloat(localStorage.getItem('phase_'+this.props.list)))
    
  }
  componentWillUpdate(){
    var _phase ;
    typeof this.props.numElem !== 'undefined' && !this.props.numElem
    ? this.rewindPages()
    : (
      this.phases[this.state.phaseBefore] = false,
      _phase = this.returnPhasePerType(),
      this.phases[_phase] = true,
        _phase>=(this.state.phases.length-1)-this.state.phasePage
        ? this.setState({
          'phase':_phase,
          'acumulate':(this.state.phases.length-1)-this.state.phasePage,
          'phases': this.phases,
          'phaseBefore':_phase
        })
        : this.setState({
          'phase':_phase,
          'acumulate':_phase,
          'phases': this.phases,
          'phaseBefore':_phase
        })
    )
  }
  render() {
    return (
      <div className={this.state.phases.length >=2 ? 'pages' : 'hide' }  >
          <div className={ this.state.phases.length <= this.state.phasePage || this.state.acumulate === 0 ? 'hide' : "item_page" }  onClick={this.rewindPages} >
            ❮
          </div>
          {
              this.state.phases.map((p,index) => (
                index === this.phases.length-1 || ( index < this.state.acumulate + this.state.phasePage && index >= this.state.acumulate ) || ( this.state.phase + this.state.phasePage >= this.phases.length-1 && index===0)
                    ? <div className={ p ? "item_page_selected" : "item_page" } onClick={ () => this.setPhase(index)} >{index+1}
                      </div>
                    : index === this.phases.length-2 || ( this.state.phase + this.state.phasePage >= this.phases.length-1 && index===1)
                      ? <div className="item_page_dots" onClick={this.fromDots} >...</div>
                      : ''
            ))
          }
          <div className={  this.state.phase >= this.phases.length-1 || this.state.phases.length-1 <= this.state.phasePage ? 'hide' : "item_page" }  onClick={this.forwardPages} >
            ❯
          </div>
      </div>
    )
  }
};
Pages.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Pages);
export default Pages;