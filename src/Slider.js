//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';

class Slider extends Component {
  constructor(props) {
    super();
    //this.onMouseOver = this.onMouseOver.bind(this);
    //this.onClick = this.onClick.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  
  onMouseOverWithValue(value) {
    return (e) => {
      //console.log('onMouseOver', value, this.props.name);
      window.cursor.dispatch({type:'setSliderDragValue', value:value, name:this.props.name});
    }
  }
  onMouseLeave(e) {
    //console.log('onMouseLeave');
    window.cursor.dispatch({type:'setSliderDragValue'});
  }
  onClickWithValue(value) {
    return (e) => {
      //console.log('onClick', value);
      window.cursor.dispatch({type:'setSliderValue', value:value, name:this.props.name});
      window.cursor.dispatch({type:'setSliderDragValue'});
    }
  }

  render() {
    this.cellWidth = Math.floor(this.props.cellSize * 2.0 / 3.0);
    const valueCur = (this.props.slider && this.props.slider.name===this.props.name) ?
      this.props.slider.value : this.props.value;
    const cellStyle = {width:this.cellWidth, height:this.props.cellSize};
    const sections = (new Array(this.props.sections)).fill(0).map((_e, index) => {
      var className = (index===0) ? 'sliderCellFirst' : 'sliderCell';
      const value = (index+1)/this.props.sections;
      if (valueCur >= value) {
        className += ' sliderCellOn';
      }
      return <div className={className}
           onClick={this.onClickWithValue(value)}
           onMouseOver={this.onMouseOverWithValue(value)}
                  key={index}
                  style={cellStyle}></div>;
    });
    return (
      <div style={{float:'left'}}>
      <div className='sliderCellZero'
           onClick={this.onClickWithValue(0)}
           style={cellStyle}></div>
      <div className='sliderFrame'
           onMouseLeave={this.onMouseLeave}
        >
        {sections}
      </div>
      </div>
    );
  }
}

export default Slider;
