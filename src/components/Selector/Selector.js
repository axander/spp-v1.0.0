import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import Utils from '../../utils/Utils.js';
import { Link } from 'react-router-dom'
import './Selector.scss'

class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        'list':this.props.list.sort(Utils.dynamicSort("name")),
        'show':false,
        'value':''
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onFocusResponsive = this.onFocusResponsive.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.opClick = this.opClick.bind(this);
  }
  
  componentDidUpdate() {
    // Will execute as normal
  }
  onFocus(){
    this.setState({
      'show':true
    })
  }
  onFocusResponsive(){
    this.setState({
      'value':'',
      'show':true,
      'responsive':true
    })
  }
  onBlur(){
    this.setState({
      'show':false
    })
  }
  opClick(_name, _id){
    switch(this.state.responsive){
      case true:
        this.setState({
          'value':_name,
          'responsive':false,
          'show':false
        });
      break;
      default:
        this.setState({
          'value':_name,
          'responsive':false,
        });
      break;
    }
    this.props.changeSelector(this.props.type, _name);
  }
  handleChange(event) {
    switch(event.target.id){
      case 'selector-browse':
          this.state.value = event.target.value;
          this.setState({
            'value': event.target.value
          })
      break;
      default:
      break
    }

  }
  render() {
    return (
      <div class='selector' >
        <input id="selector-browse" type="text" value={this.state.value} onFocus={this.onFocus} onBlur={ this.onBlur } onChange={this.handleChange}  placeholder={this.translate('select.'+this.props.type)} />
        <div className="selector-browse-pb" onClick={this.onFocusResponsive} >{this.state.value === '' ? this.translate('select.'+this.props.type) : this.state.value}</div>
        <div className={this.state.show ? "row" : "row hide"  } >
          <div class="selector-options-container" >
              {
                this.state.list.map((p, index)  => (
                    <div className={this.state.value==='' || p.name.toLowerCase().indexOf(this.state.value.toLowerCase()) === 0 ? 'selector-item' : 'selector-item hide' } onMouseDown={(name, id) => this.opClick(p.name, p.id)} id={p.name} >{p.name}</div>
                ))
              }
          </div>
        </div>
      </div>  
    );
  }
}
Selector.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Selector);
export default Selector;