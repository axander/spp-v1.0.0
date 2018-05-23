import React from 'react'
import TranslatedComponent from '../../utils/TranslatedComponent.js'
import ListBlock from './items/ListBlock.js'
import ListItem from './items/ListItem.js'
import Utils from '../../utils/Utils.js'
import './ListSchemma.scss'


// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.


class ListSchemma extends React.Component {
  constructor(props) {
    super(props);
    console.log('favs');
    console.log(props);
    this.state = {
      'list':null,
      'show': false,
      'data':[],
      'showModal':false,
      'type': null,
      'action':null,
      'newFolder':'',
      'validFolder':false,
      'originId':'',
      'destinyId':'',
      'originName':'',
      'movItemObject':null,
      'msg':''
    };
    this.recursiveCloneChildren = this.recursiveCloneChildren.bind(this);
    this.showSchemma = this.showSchemma.bind(this);
    this.hideSchemma = this.hideSchemma.bind(this);
    this.newFolder = this.newFolder.bind(this);
    this.removeFolder = this.removeFolder.bind(this);
    this.renameFolder = this.renameFolder.bind(this);
    this.removeFromFolder = this.removeFromFolder.bind(this);
    this.addToFolder = this.addToFolder.bind(this);
    this.moveToFolder = this.moveToFolder.bind(this);
    this.moveChild = this.moveChild.bind(this);
    this.moveFolderToFolder = this.moveFolderToFolder.bind(this);
    this.moveFolder = this.moveFolder.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeModalError = this.closeModalError.bind(this);
    this.newFolderAction = this.newFolderAction.bind(this);
    this.removeFolderAction = this.removeFolderAction.bind(this);
    this.addToFolderAction = this.addToFolderAction.bind(this);
    this.removeFromFolderAction = this.removeFromFolderAction.bind(this);
    this.moveToFolderAction = this.moveToFolderAction.bind(this);
    this.moveChildAction = this.moveChildAction.bind(this);
    this.execute = this.execute.bind(this);
    this.focusBlock = this.focusBlock.bind(this);
    this.focusItem = this.focusItem.bind(this);
    this.unfocus = this.unfocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.forceOpen = this.forceOpen.bind(this);
    this.toStorage = this.toStorage.bind(this);
    this.goTo =  this.goTo.bind(this);
  }
  recursiveCloneChildren(child){
    if(child.folder) { 
        child.children.sort(function(a,b) {
          var x = typeof a.folder !== 'undefined' ? a.folder.toLowerCase() : a.name[localStorage.getItem('language')].toLowerCase();
          var y = typeof b.folder !== 'undefined' ? b.folder.toLowerCase() : b.name[localStorage.getItem('language')].toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        })
      return  (
                child.children.map( p => (
                    !p.children ? (<ListItem id={p.id} data={p} originId={child.id} originName={child.folder} name={p.name[localStorage.getItem('language')]}  focus={this.focusItem} unfocus={this.unfocus} goTo={this.goTo} />) : (<ListBlock id={p.id} folder={p.folder} focus={this.focusBlock} unfocus={this.unfocus} recursive={this.recursiveCloneChildren(p)} />)
                ))
              )
              
    }
    return <div>{child.id}</div>
  }
  hideSchemma(){
    localStorage.getItem('savingList')
    ? (
        localStorage.removeItem('savingList'),
        window.location.reload()
      )
    :this.setState({
        'show': false
      })
  }
  showSchemma(_what, _where, _item){
    this.setState({
        'what': _what,
        'where': _where,
        'id': _item.id,
        'show': true,
        'data': this.props.initSchemma.setSchemma,
        'itemObject': _item
      })
  }
  /*var byDate = arrayOfObjects.slice(0);
  byDate.sort(function(a,b) {
      return a.born - b.born;
  });
  console.log('by date:');
  console.log(byDate);*/
  addFolder(_object, _folder){
    console.log('enter here');
    for( var j in _object){
        typeof _object[j] !== 'undefined' && _object[j].folder
        ? ( 
            ( this.state.type === 'folder' && _object[j].id == this.state.idSelected ) || ( this.state.type === 'children' && _object[j].id == this.state.originId )
            ? (
              _object[j].children.push(_folder),
              _object[j].children.sort(function(a,b) {
                  var x = typeof a.folder !== 'undefined' ? a.folder.toLowerCase() : a.name[localStorage.getItem('language')].toLowerCase();
                  var y = typeof b.folder !== 'undefined' ? b.folder.toLowerCase() : b.name[localStorage.getItem('language')].toLowerCase();
                  return x < y ? -1 : x > y ? 1 : 0;
              }),
              this.setState({
                'action':null,
                'showModal':false,
                'validFolder':false,
                'newFolder':''
              }),
              this.forceOpen(),
              this.toStorage(this.state.where, this.state.what)
            )
            : this.addFolder(_object[j].children,_folder)
          )
        : null;
    }
  }
  newFolder(){
    this.state.idSelected
    ? this.setState({
        'showModal':true,
        'action':'addFolder',
        'newFolder':'',
        'validFolder':false
      })
    : this.setState({
      'showModalError':true,
      'modalErrorMsg':'Select first a folder where adding the item'
    });
  }
  newFolderAction(){
    this.state.newFolder.length>0
    ? (
      this.addFolder(this.state.data, {
        "folder":Utils.rtrim(this.state.newFolder),
        "id":new Date().getTime(),
        "children":[]
      })
    )
    : this.setState({
      'msg':'Por favor introduce un nombre válido'
    })
  }
  rmFolder(_object){
    for( var j in _object){
        typeof _object[j] !== 'undefined' && _object[j].folder
        ? ( 
            _object[j].id == this.state.idSelected
            ? (
              this.unfocus(),
              this.unfocus = null,
              _object.splice(j,1),
              this.setState({
                'action':null,
                'showModal':false,
                'validFolder':false,
                'newFolder':''
              }),
              this.toStorage(this.state.where, this.state.what)
            )
            : this.rmFolder(_object[j].children)
          )
        : null;
    }
  }
  removeFolder(){
    this.state.idSelected
    ?  this.setState({
        'showModal':true,
        'action':'removeFolder'
      })
    : this.setState({
      'showModalError':true,
      'modalErrorMsg':'Select first a folder to remove'
    });
  }
  removeFolderAction(){
    this.rmFolder(this.state.data)
  }
  rnmFolder(_object, _name){
    console.log('enter here');
    for( var j in _object){
        typeof _object[j] !== 'undefined' && _object[j].folder
        ? ( 
            _object[j].id == this.state.idSelected
            ? (
              _object[j].folder = _name,
              _object[j].children.sort(function(a,b) {
                  var x = typeof a.folder !== 'undefined' ? a.folder.toLowerCase() : a.name[localStorage.getItem('language')].toLowerCase();
                  var y = typeof b.folder !== 'undefined' ? b.folder.toLowerCase() : b.name[localStorage.getItem('language')].toLowerCase();
                  return x < y ? -1 : x > y ? 1 : 0;
              }),
              this.setState({
                'action':null,
                'showModal':false,
                'validFolder':false,
                'newFolder':''
              }),
              this.toStorage(this.state.where, this.state.what)
            )
            : this.rnmFolder(_object[j].children,_name)
          )
        : null;
    }
  }
  renameFolder(){
    this.state.idSelected
    ? this.setState({
        'showModal':true,
        'action':'renameFolder'
      })
    : this.setState({
      'showModalError':true,
      'modalErrorMsg':'Select first a folder where adding the item'
    });
  }
  renameFolderAction(){
    this.state.newFolder.length>0
    ? (
      this.rnmFolder(this.state.data, Utils.rtrim(this.state.newFolder))
    )
    : this.setState({
      'msg':'Por favor introduce un nombre válido'
    })
  }
  toFolder(_object, _item, _idSelected){

    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          console.log(_object[j].id + ' ' + _idSelected);
          if(_object[j].id == _idSelected){
            console.log(_item);
            _object[j].children.push(_item);
            _object[j].children.sort(function(a,b) {
                var x = typeof a.folder !== 'undefined' ? a.folder.toLowerCase() : a.name[localStorage.getItem('language')].toLowerCase();
                var y = typeof b.folder !== 'undefined' ? b.folder.toLowerCase() : b.name[localStorage.getItem('language')].toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
            this.setState({
              'action':null,
              'showModal':false
            });
            this.forceOpen();
            this.toStorage(this.state.where, this.state.what);
          }else{
            this.toFolder(_object[j].children, _item, _idSelected)
          }
        }
    }
  }
  addToFolder(){
    this.state.idSelected
    ? this.setState({
      'showModal':true,
      'action':'addToFolder'
      })
    : this.setState({
      'showModalError':true,
      'modalErrorMsg':'Select first a folder where adding the item'
    });
  }
  addToFolderAction(){
    this.state.type === 'folder'
    ? this.toFolder(this.state.data, this.state.itemObject, this.state.idSelected)
    : this.toFolder(this.state.data, this.state.itemObject, this.state.originId)
  }
  rmvFromFolder(_object, _idSelected, _originId){
    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          if(_object[j].id == _originId){
            for( var k in _object[j].children ){
              if(_object[j].children[k].id == _idSelected){
                this.unfocus();
                this.unfocus = null;
                _object[j].children.splice(k,1);
                this.setState({
                  'action':null,
                  'showModal':false,
                  'type':null,
                  'idSelected': null,
                  'nameSelected': null,
                  'originId':null,
                  'originName': null,
                  'destinyId':null
                });
                this.toStorage(this.state.where, this.state.what);
                break;
              } 
            }
          }else{
            this.rmvFromFolder(_object[j].children, _idSelected, _originId)
          }
        }
    }
  }
  removeFromFolder(){
    this.state.idSelected
    ? this.setState({
      'showModal':true,
      'action':'removeFromFolder'
    })
    : this.setState({
      'showModalError':true,
      'modalErrorMsg':'Select first a folder where adding the item'
    });
  }
  removeFromFolderAction(){
    this.rmvFromFolder(this.state.data, this.state.idSelected, this.state.originId)
  }
  getItemToMove(_object, _idSelected, _originId){
    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          if(_object[j].id == _originId){
            for( var k in _object[j].children ){
              if(_object[j].children[k].id == _idSelected){
                this.setState({
                  'movItemObject':_object[j].children[k],
                  'movingItem':true,
                  'showModal':false
                });
                this.toStorage(this.state.where, this.state.what);
                break;
              } 
            }
          }else{
            this.getItemToMove(_object[j].children, _idSelected, _originId)
          }
        }
    }
  }
  moveToFolder(){
    this.setState({
      'showModal':true,
      'action':'moveToFolder'
    })
  }
  moveToFolderAction(){
    this.getItemToMove(this.state.data, this.state.idSelected, this.state.originId)
  }
  mvTo(_object, _movItemObject, _destinyId){
    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          if(_object[j].id == _destinyId){
            _object[j].children.push(_movItemObject);
            _object[j].children.sort(function(a,b) {
                var x = typeof a.folder !== 'undefined' ? a.folder.toLowerCase() : a.name[localStorage.getItem('language')].toLowerCase();
                var y = typeof b.folder !== 'undefined' ? b.folder.toLowerCase() : b.name[localStorage.getItem('language')].toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
            this.setState({
              'action':null,
              'showModal':false,
              'movingItem':false
            });
            this.forceOpen();
            this.toStorage(this.state.where, this.state.what);
          }else{
            this.mvTo(_object[j].children, _movItemObject, _destinyId)
          }
        }
    }
  }
  moveChild(){
    this.setState({
      'showModal':true,
      'action':'moveChild'
    })
  }
  moveChildAction(){
    this.rmvFromMove(this.state.data, this.state.idSelected, this.state.originId);
    this.mvTo(this.state.data, this.state.movItemObject, this.state.destinyId);
  }
  rmvFromMove(_object, _idSelected, _originId){
    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          if(_object[j].id == _originId){
            for( var k in _object[j].children ){
              if(_object[j].children[k].id == _idSelected){
                this.unfocus();
                this.unfocus = null;
                _object[j].children.splice(k,1);
                this.setState({
                  'action':null,
                  'showModal':false,
                  'type':null,
                  'idSelected': null,
                  'nameSelected': null,
                  'originId':null,
                  'originName': null
                });
                break;
              } 
            }
          }else{
            this.rmvFromMove(_object[j].children, _idSelected, _originId)
          }
        }
    }
  }
  //moving folder
  getFolderToMove(_object, _idSelected){
    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          if(_object[j].id == _idSelected){
            this.setState({
              'movFolderObject':_object[j],
              'movingFolder':true,
              'showModal':false
            })
          }else{
            this.getFolderToMove(_object[j].children, _idSelected)
          }
        }
    }
  }
  moveFolderToFolder(){
    this.state.idSelected
    ? this.setState({
      'showModal':true,
      'action':'moveFolderToFolder'
    })
    : this.setState({
      'showModalError':true,
      'modalErrorMsg':'Select first a folder where adding the item'
    });
  }
  moveFolderToFolderAction(){
    this.getFolderToMove(this.state.data, this.state.idSelected)
  }
  mvFolderTo(_object, _movFolderObject, _destinyId){
    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          if(_object[j].id == _destinyId){
            console.log(_movFolderObject);
            console.log(_destinyId);
            _object[j].children.push(_movFolderObject);
            _object[j].children.sort(function(a,b) {
                var x = typeof a.folder !== 'undefined' ? a.folder.toLowerCase() : a.name[localStorage.getItem('language')].toLowerCase();
                var y = typeof b.folder !== 'undefined' ? b.folder.toLowerCase() : b.name[localStorage.getItem('language')].toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
            this.setState({
              'action':null,
              'showModal':false,
              'movingFolder':false
            });
            this.forceOpen();
            this.toStorage(this.state.where, this.state.what);
          }else{
            this.mvFolderTo(_object[j].children, _movFolderObject, _destinyId)
          }
        }
    }
  }
  moveFolder(){
    this.setState({
      'showModal':true,
      'action':'moveFolder'
    })
  }
  moveFolderAction(){
    this.rmvFolderFromMove(this.state.data, this.state.movFolderObject.id);
    this.mvFolderTo(this.state.data, this.state.movFolderObject, this.state.destinyId);
  }
  rmvFolderFromMove(_object, _originId){
    for( var j in _object){
        if(typeof _object[j] !== 'undefined' && _object[j].folder){
          if(_object[j].id == _originId){
            this.unfocus();
            this.unfocus = null;
            _object.splice(j,1);
            this.setState({
              'action':null,
              'showModal':false,
              'type':null,
              'idSelected': null,
              'nameSelected': null,
              'originId':null,
              'originName': null
            });
          }else{
            this.rmvFolderFromMove(_object[j].children, _originId)
          }
        }
    }
  }
  execute(){
    switch(this.state.action){
      case 'addFolder':
        this.newFolderAction();
      break;
      case 'removeFolder':
        this.removeFolderAction();
      break;
      case 'renameFolder':
        this.renameFolderAction();
      break;
      case 'addToFolder':
        this.addToFolderAction();
      break;
      case 'moveToFolder':
        this.moveToFolderAction();
      break;
      case 'moveChild':
        this.moveChildAction();
      break;
      case 'moveFolderToFolder':
        this.moveFolderToFolderAction();
      break;
      case 'moveFolder':
        this.moveFolderAction();
      break;
      case 'removeFromFolder':
        this.removeFromFolderAction();
      break;
      default:
      break;
    }
  }
  closeModal(){
    this.setState({
      'showModal':false,
      'movingItem':false,
      'movingFolder':false
    });
  }
  closeModalError(){
    this.setState({
      'showModalError':false,
      'modalErrorMsg':false
    });
  }
  focusBlock(_exec, _type, _id, _name, _forceOpen){
    this.forceOpen = _forceOpen;
    this.unfocus ? this.unfocus() : null;
    this.unfocus = _exec;
    !this.state.movingItem && !this.state.movingFolder
    ? this.setState({
        'type':_type,
        'idSelected': _id,
        'nameSelected': _name
      })
    : this.setState({
        'type':_type,
        'destinyId':_id,
        'nameSelected': _name
      })
  }
  focusItem(_exec, _type, _id, _name, _originId, _originName){
    this.unfocus ? this.unfocus() : null;
    this.unfocus = _exec
    !this.state.movingItem && !this.state.movingFolder
    ? this.setState({
        'type':_type,
        'idSelected': _id,
        'nameSelected': _name,
        'originId':_originId,
        'originName': _originName
      })
    : this.setState({
        'type':'folder',
        'destinyId':_originId,
        'nameSelected': _originName
      });
  }
  goTo(_data){
    switch(this.state.what){
      case 'channel':
        this.hideSchemma();
        localStorage.setItem('lastItemDatapodcast',JSON.stringify(_data));
        localStorage.setItem('lastChannelName',_data.name);
        history.pushState(null, './#/podcast/'+_data.id+'/'+_data.name[localStorage.getItem('language')]);
        window.location.href = './#/podcast/'+_data.id+'/'+_data.name[localStorage.getItem('language')];
        window.location.reload();
      break;
      case 'podcast':
        this.hideSchemma();
        localStorage.setItem('lastItemDataepisode',JSON.stringify(_data));
        localStorage.setItem('lastpodcastName',JSON.stringify(_data.name));
        window.location.href = './#/episode/'+_data.id+'/'+_data.name[localStorage.getItem('language')];
        window.location.reload();
      break;
      case 'episode':
        this.hideSchemma();
        localStorage.setItem('lastItemDatastatic',JSON.stringify(_data));
        this.props.initplayer.play(_data.file, _data.id, _data.name, _data);
        window.location.href = './#/static/'+_data.id+'/'+_data.name[localStorage.getItem('language')];
        window.location.reload();
      break;
      default:
      break;
   }
  }
  forceOpen(){
  }
  unfocus(){
  }
  handleChange(event) {
    switch(event.target.id){
      case 'newFolder':
        this.setState({
          'newFolder':Utils.ltrim(event.target.value),
          'validFolder':Utils.ltrim(event.target.value).length>0
        })
      break;
      case 'renameFolder':
        this.setState({
          'newFolder':Utils.ltrim(event.target.value),
          'validFolder':Utils.ltrim(event.target.value).length>0
        })
      break;
      default:
      break
    }
  }
  //save to LocalStorage
  toStorage(_where, _what){
    var schemma = JSON.parse(localStorage.getItem('client'));
    console.log(schemma.listData[_where][_what]);
    schemma.listData[_where][_what] = this.state.data;
    localStorage.setItem('client', JSON.stringify(schemma));
  }
  componentWillMount(){
    this.props.initSchemma.show = this.showSchemma;
  }

  render() {
    let removeChildren = null;
    let addFolder = null;
    let removeFolder = null;
    let renameFolder = null;
    let addToFolder = null;
    let moveToFolder = null;
    let cancelMoveToFolder = null;
    let moveChild = null;
    let moveFolderToFolder = null;
    let cancelMoveFolderToFolder = null;
    let moveFolder = null;
    if(this.state.movingFolder){
      removeChildren = null;
      addFolder = null;
      removeFolder = null;
      renameFolder = null;
      addToFolder = null;
      moveToFolder = null;
      moveChild = null;
      cancelMoveToFolder = null;
      moveFolderToFolder = null;
      cancelMoveFolderToFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel move folder to Folder</div></div>;
      moveFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.moveFolder}>Move Folder</div></div>;
    }else if(this.state.movingItem){
      removeChildren = null;
      addFolder = null;
      removeFolder = null;
      renameFolder = null;
      addToFolder = null;
      moveToFolder = null;
      moveChild = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.moveChild}>Move</div></div>;
      cancelMoveToFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel move to Folder</div></div>;
      moveFolderToFolder = null;
      cancelMoveFolderToFolder = null;
      moveFolder = null;
    }else if(this.state.type === 'children'){
      removeChildren = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.removeFromFolder}>Remove from Folder</div></div>;
      addFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.newFolder} >Create Folder</div></div>;
      removeFolder = null;
      renameFolder = null;
      addToFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.addToFolder}>Add to Folder</div></div>;
      moveToFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.moveToFolder}>Move to Folder</div></div>;
      moveChild = null;
      cancelMoveToFolder = null;
      moveFolderToFolder = null;
      cancelMoveFolderToFolder = null;
      moveFolder = null;
    }else{
      removeChildren = null;
      addFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.newFolder} >Create Folder</div></div>;
      if(this.state.idSelected !== 'ROOT'){
        removeFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.removeFolder}>Delete Folder</div></div>;
        renameFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.renameFolder}>Rename Folder</div></div>;
        moveFolderToFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.moveFolderToFolder}>Move Folder to Folder</div></div>;
      }else{
        removeFolder = null;
        renameFolder = null;
        moveFolderToFolder = null;
      }
      addToFolder = <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.addToFolder}>Add to Folder</div></div>;
      moveChild = null;
      moveToFolder = null;
      cancelMoveToFolder = null;
      cancelMoveFolderToFolder = null;
      moveFolder = null;
    }
    
    return (
      <div className={this.state.show ? 'listSchemma_container show':'listSchemma_container' }>
        <div className='rot' >{this.state.what+' '+this.state.where+' '+this.state.itemObject }</div>
        <div className='hideSchemma' onClick={this.hideSchemma} >X</div>
        <list>
          {
            this.state.data.map( p => (
                !p.children ? (<ListItem id={p.id} data={p} originId={this.state.data.id} originName={this.state.data.folder} name={p.name[localStorage.getItem('language')]} focus={this.focusItem} unfocus={this.unfocus} goTo={this.goTo} />) : (<ListBlock id={p.id} folder={p.folder} focus={this.focusBlock} unfocus={this.unfocus} recursive={this.recursiveCloneChildren(p)} />)
            ))
          }
        </list>
        <div class="listPBs" >
          <div class="row" >
            {removeChildren}
            {addToFolder}
            {addFolder}
            {removeFolder}
            {renameFolder}
            {moveToFolder}
            {moveChild}
            {cancelMoveToFolder}
            {moveFolderToFolder}
            {moveFolder}
            {cancelMoveFolderToFolder}
          </div>
        </div>
        <div className={this.state.showModal ? "listMsgOuter" : "listMsgOuter hide" } >
          <div class="listMsgInner">
            <div class="listMsg">
              <div className={ this.state.action === 'addFolder' ? "addFolderAction" : "addFolderAction hide" }  >
                <div>
                  { 'intro a name an create a new folder in'+ ( this.state.type ==='folder' ? this.state.nameSelected : this.state.originName ) + ' named '+ this.state.newFolder }
                </div>
                <div>
                  <input onChange={this.handleChange} id="newFolder" type="text" class=" input_web_dark" placeholder="Name" value={this.state.newFolder} />
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div className={ this.state.validFolder ? 'listPB': 'hide' } onclick={this.execute} >Create</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'removeFolder' ? "removeFolderAction" : "removeFolderAction hide" } >
                <div>
                  { 'Are you sure in deleting folder and all its content'+ this.state.nameSelected }
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div class="listPB" onclick={this.execute} >Remove</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'renameFolder' ? "renameFolderAction" : "renameFolderAction hide" } >
                <div>
                  { 'intro the new name for folder'+ this.state.nameSelected + ' will be: '+ this.state.newFolder }
                </div>
                <div>
                  <input onChange={this.handleChange} id="renameFolder" type="text" class=" input_web_dark" placeholder="Name" value={this.state.newFolder} />
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div className={ this.state.validFolder ? 'listPB': 'hide' } onclick={this.execute} >Rename</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'addToFolder' ? "addToFolderAction" : "addToFolderAction hide" } >
                <div>
                  { 'Add '+this.state.id+' '+'to folder'+ ( this.state.type === 'folder' ? this.state.nameSelected : this.state.originName ) }
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div class="listPB" onclick={this.execute} >Add to folder</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'removeFromFolder' ? "removeFromFolderAction" : "removeFromFolderAction hide" } >
                <div>
                  { 'Are you sure in deleting the element '+ this.state.nameSelected }
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div class="listPB" onclick={this.execute} >Remove from folder</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'moveToFolder' ? "moveToFolderAction" : "moveToFolderAction hide" } >
                <div>
                  { 'Now select the folder to move '+ this.state.nameSelected }
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div class="listPB" onclick={this.execute} >Move to folder</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'moveChild' ? "moveChildAction" : "moveChildAction hide" } >
                <div>
                  { 'Are you sure in Moving the element to'+ (this.state.type ==='folder' ? this.state.nameSelected : this.state.originName ) }
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div class="listPB" onclick={this.execute} >Move</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'moveFolderToFolder' ? "moveFolderToFolderAction" : "moveFolderToFolderAction hide" } >
                <div>
                  { 'Now select the folder to move '+ this.state.nameSelected }
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div class="listPB" onclick={this.execute} >Move folder to folder</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
              <div className={ this.state.action === 'moveFolder' ? "moveFolderAction" : "moveFolderAction hide" } >
                <div>
                  { 'Are you sure in Moving the folder to'+ (this.state.type ==='folder' ? this.state.nameSelected : this.state.originName ) }
                </div>
                <div>
                  {this.state.msg}
                </div>
                <div class="row modalPBs" >
                  <div class="col-xs-offset-3 col-xs-3 col-md-3"><div class="listPB" onclick={this.execute} >Move</div></div>
                  <div class="col-xs-3 col-md-3"><div class="listPB" onclick={this.closeModal}>Cancel</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={this.state.showModalError ? "listMsgOuter" : "listMsgOuter hide" } >
          <div class="listMsgInner">
            <div class="listMsg">
              <div>
                {this.state.modalErrorMsg}
                <div class="row modalPBs" >
                  <div class="col-xs-offset-4 col-md-offset-4 col-xs-4 col-md-4"><div class="listPB" onclick={this.closeModalError}>Close</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
}

ListSchemma.propTypes = {
  //who: React.PropTypes.string.isRequired,
};


// Returns nothing because it mutates the class
TranslatedComponent(ListSchemma);
export default ListSchemma;