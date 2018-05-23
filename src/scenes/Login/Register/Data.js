import React from 'react'
import TranslatedComponent from '../../../utils/TranslatedComponent.js';
import Utils from '../../../utils/Utils.js';
import Selector from '../../../components/Selector/Selector.js';
import { Link } from 'react-router-dom'
import './Data.scss'
const provinces =[{
  "id": "04",
  "name": "Almería"
}, {
  "id": "11",
  "name": "Cádiz"
}, {
  "id": "14",
  "name": "Córdoba"
}, {
  "id": "18",
  "name": "Granada"
}, {
  "id": "21",
  "name": "Huelva"
}, {
  "id": "23",
  "name": "Jaén"
}, {
  "id": "29",
  "name": "Málaga"
}, {
  "id": "41",
  "name": "Sevilla"
}, {
  "id": "22",
  "name": "Huesca"
}, {
  "id": "44",
  "name": "Teruel"
}, {
  "id": "50",
  "name": "Zaragoza"
}, {
  "id": "33",
  "name": "Asturias"
}, {
  "id": "07",
  "name": "Balears, Illes"
}, {
  "id": "35",
  "name": "Palmas, Las"
}, {
  "id": "38",
  "name": "Santa Cruz de Tenerife"
}, {
  "id": "39",
  "name": "Cantabria"
}, {
  "id": "05",
  "name": "Ávila"
}, {
  "id": "09",
  "name": "Burgos"
}, {
  "id": "24",
  "name": "León"
}, {
  "id": "34",
  "name": "Palencia"
}, {
  "id": "37",
  "name": "Salamanca"
}, {
  "id": "40",
  "name": "Segovia"
}, {
  "id": "42",
  "name": "Soria"
}, {
  "id": "47",
  "name": "Valladolid"
}, {
  "id": "49",
  "name": "Zamora"
}, {
  "id": "02",
  "name": "Albacete"
}, {
  "id": "13",
  "name": "Ciudad Real"
}, {
  "id": "16",
  "name": "Cuenca"
}, {
  "id": "19",
  "name": "Guadalajara"
}, {
  "id": "45",
  "name": "Toledo"
}, {
  "id": "08",
  "name": "Barcelona"
}, {
  "id": "17",
  "name": "Girona"
}, {
  "id": "25",
  "name": "Lleida"
}, {
  "id": "43",
  "name": "Tarragona"
}, {
  "id": "03",
  "name": "Alicante/Alacant"
}, {
  "id": "12",
  "name": "Castellón/Castelló"
}, {
  "id": "46",
  "name": "Valencia/València"
}, {
  "id": "06",
  "name": "Badajoz"
}, {
  "id": "10",
  "name": "Cáceres"
}, {
  "id": "15",
  "name": "Coruña, A"
}, {
  "id": "27",
  "name": "Lugo"
}, {
  "id": "32",
  "name": "Ourense"
}, {
  "id": "36",
  "name": "Pontevedra"
}, {
  "id": "28",
  "name": "Madrid"
}, {
  "id": "30",
  "name": "Murcia"
}, {
  "id": "31",
  "name": "Navarra"
}, {
  "id": "01",
  "name": "Araba/Álava"
}, {
  "id": "48",
  "name": "Bizkaia"
}, {
  "id": "20",
  "name": "Gipuzkoa"
}, {
  "id": "26",
  "name": "Rioja, La"
}, {
  "id": "51",
  "name": "Ceuta"
}, {
  "id": "52",
  "name": "Melilla"
}]
class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     'typeDoc':'',
     'doc':'',
     'address':'',
     'cp':'',
     'country':'',
     'province':'',
     'showedMsg': localStorage.getItem('error'),
     'isOpen': localStorage.getItem('error') ? true : false,
     'deactive': 'disabled',
     'success':false
    };
    this.handleChange = this.handleChange.bind(this);
    this.changeSelector = this.changeSelector.bind(this);
  }
  
  componentDidUpdate() {
    // Will execute as normal
  }

  handleChange(event) {
    switch(event.target.id){
      case 'typeDoc':
          this.setState({[event.target.id]:event.target.value});
      break;
      case 'doc':
          this.setState({[event.target.id]:event.target.value});
      break;
      case 'address':
          this.setState({[event.target.id]:event.target.value});
      break;
      case 'cp':
          this.setState({[event.target.id]:event.target.value});
      break;
      case 'country':
          this.setState({[event.target.id]:event.target.value});
      break;
      case 'province':
          this.setState({[event.target.id]:event.target.value});
      break;
      default:
          this.setState({[event.target.id]:event.target.value});
      break
    }
    this.state.typeDoc !== '' && this.state.doc !== '' && this.state.address !== '' && this.state.cp && this.state.country !== '' && this.state.province !== ''
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
    
  }
  changeSelector(_data, _value){
    this.setState({
      [_data]:_value
    });
    this.state.typeDoc !== '' && this.state.doc !== '' && this.state.address !== '' && this.state.cp && this.state.country !== '' && this.state.province !== ''
    ? this.state.deactive = ''
    : this.state.deactive = 'disabled';
  }
  render() {
    return (
      <div style={this.state.style} >
        <data>
          <div class='mt50 mb50 data'>
                  <form onSubmit={this.handleSubmit} autocomplete="on" >
                  	<div className="data_input_25" ><input id="typeDoc" type="text"  onChange={this.handleChange} value={this.state.typeDoc} placeholder={this.translate('typeDoc')} /></div>
                  	<div className="data_input_75" ><input id="doc" type="text"  onChange={this.handleChange} value={this.state.doc} placeholder={this.translate('doc')} /></div>
                    <div><input id="address" type="text"  onChange={this.handleChange} value={this.state.address} placeholder={this.translate('address')} /></div>
                    <div><input id="cp" type="text"  onChange={this.handleChange} value={this.state.cp} placeholder={this.translate('cp')} /></div>
                    <div className="data_input_40" ><input id="country" type="text"  onChange={this.handleChange} value={this.state.country} placeholder={this.translate('country')} /></div>
                    {/*<div className="data_input_60" ><input id="province" type="text"  onChange={this.handleChange} value={this.state.province} placeholder={this.translate('province')} /></div>*/}
                    <div className="data_input_60" ><Selector changeSelector={this.changeSelector} list={provinces} type='province' /></div>
                    <div className="mt50 right data_continue" ><div className={"greenPB " + this.state.deactive }  onClick={() => this.props.flow(this.state,'data')} >{this.props.type === 'Basic' ? this.translate('register.finalize') : this.translate('register.continue')}</div></div>
            	      <div className="mt50 left data_back" ><div className="neutralPB" onClick={() => this.props.back('choose')} >{this.props.type === 'Basic' ? this.translate('register.cancel') : this.translate('back2')}</div></div>
                  </form>
          </div>
        </data>
      </div>  
    );
  }
}
Data.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(Data);
export default Data;