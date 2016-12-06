import React, { Component } from 'react';

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

export default Pages;