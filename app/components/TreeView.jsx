import React, {Component} from 'react';
import TreeFinder from './TreeFinder';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

@observer
class TreeView extends Component {
  render() {
    return (
      <div className="code__box">
        <TreeFinder codes={this.props.contents.html}></TreeFinder>
        <TreeFinder codes={this.props.contents.css}></TreeFinder>
        <TreeFinder codes={this.props.contents.js}></TreeFinder>
      </div>
    );
  }
}

export default TreeView;
