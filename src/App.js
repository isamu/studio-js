import React, { Component } from 'react';
import './App.css';
import Publisher from './Publisher';
import createStore from './SimpleRedux';
import DragContext from './DragContext';
import Element from './Element';
import Page from './Page';

// Create the store with a reducer
window.store = createStore((_state, action)=> {
  if (typeof _state === "undefined") {
    return {
       elements:[{
         id:"i0", x:10, y:30, h:20, w:50, bc:'#f00'
       },{
         id:"i1", x:50, y:60, h:30, w:50, bc:'#00f'
       },{
         id:"i2", x:80, y:50, h:30, w:50, bc:'#0f0'
       }],
       pages:[{
       }]
    };
  }
  var state = Object.assign({}, _state);
  switch(action.type) {
  case 'duplicateScene':
    state.pages.unshift({});
    break;
  case 'duplicatePage':
    state.pages.splice(action.pageIndex + 1, 0, Object.assign({}, action.page));
    break;
  case 'deletePage':
    state.pages.splice(action.pageIndex, 1);
    //state.pages = state.pages.filter((p) => {return p!==action.page});
    break;
  case 'moveSceneElement':
    //console.log('moveSceneElement');
    state.elements = state.elements.map((element)=>{
       if (element.id === action.id) {
           element.x += action.dx;
           element.y += action.dy;
       }
       return element
    })
    break;
  case 'movePageElement':
    //console.log('movePageElement 1', action);
    var page = Object.assign({}, state.pages[action.pageIndex]);
    //console.log('movePageElement', page);
    var element = Object.assign({}, page[action.id] || {});
    var tx = element.translate || [0,0];
    tx = [tx[0] + action.dx, tx[1] + action.dy];
    element.translate = tx;
    page[action.id] = element;
    state.pages[action.pageIndex] = page;
    break;
  default:
    break;
  }
  return state
});

class Scene extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }
  
  onDrop(e) {
    var dragger = DragContext.getContext();
    window.store.dispatch({type:'moveSceneElement', id:dragger.id,
                    dx:e.clientX-dragger.x, dy:e.clientY-dragger.y});
  }
  onDragOver(e) {
    var dragger = DragContext.getContext();
    if (dragger.pageIndex === -1) {
        e.preventDefault();
    }
  }
  render() {
    return (
      <div>
        <div className="scene" onDrop={this.onDrop} onDragOver={this.onDragOver}>{
          this.props.elements.map((element, index)=>{
            return <Element key={index} pageIndex={-1} element={element} />
          })
        }</div>
        <button onClick={()=>{window.store.dispatch({type:'duplicateScene'})}} >Insert</button>
      </div>
    );
  }
}

class Pages extends Component {
  constructor(props) {
    super();
  }
    
  render() {
    return (
      <div>{
        this.props.pages.map((page, index)=>{ return <Page key={index} pageIndex={index} page={page} sceneElements={ this.props.elements } /> } )
      }</div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    window.store.setApplication(this);
  }
  render() {
    return (
      <div className="App">
        <button onClick={(e)=>{alert((new Publisher(window.store)).swipe())}}>Show</button>
        <Scene elements={ this.states.elements }/>
        <Pages pages={ this.states.pages } elements={ this.states.elements }/>
      </div>
    );
  }
}

export default App;
