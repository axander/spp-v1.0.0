import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js';
import './AfterPrevious.scss'

class AfterPrevious extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        'lan':localStorage.getItem('language'),
    }
  }
  componentDidMount() {
    this.setState({
      'previousDis':this.props.previousDis,
      'nextDis':this.props.nextDis,
      'nextName':this.props.nextName,
      'prevName':this.props.prevName
    })
  }
  componentWillUpdate(){
    this.setState({
      'previousDis':this.props.previousDis,
      'nextDis':this.props.nextDis,
      'nextName':this.props.nextName,
      'prevName':this.props.prevName
    })
  }
  render() {
    return (
      <div className='afterPrevious mt25 mb25' >
        <div className='row'>
          <div className="col-xs-6">
            <div className={this.state.previousDis ? 'hide' : 'afterPrevious_previous' } onClick={this.props.previous} >
              <div className='afterPrevious_title' >
                {typeof this.state.prevName !== 'undefined' ? this.state.prevName : '' }
              </div>
              <div className='afterPrevious_pb neutralPB'  >
                {this.translate('content.previous')}
              </div>
            </div>
          </div>
          <div className="col-xs-6">
            <div className={this.state.nextDis ? 'hide' : 'afterPrevious_next' } onClick={this.props.next} >
              <div className='afterPrevious_title' >
                {typeof this.state.nextName !== 'undefined' ? this.state.nextName : '' }
              </div>
              <div className='afterPrevious_pb neutralPB' >
                {this.translate('content.next')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AfterPrevious.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(AfterPrevious);
export default AfterPrevious;