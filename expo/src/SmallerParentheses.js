import React, { Component, Fragment } from 'react';


export class SmallerParentheses extends Component {
  render() {
    let reducedFontSize = { fontSize: this.props.font_size };
    return (
      <Fragment>
        <span style={reducedFontSize}>(</span>
        {this.props.children}
        <span style={reducedFontSize}>)</span>
      </Fragment>
    );
  }
}

export default SmallerParentheses;
