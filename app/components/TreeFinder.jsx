import React, {Component, PropTypes} from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import {memoize, times} from 'lodash';
import {autobind, decorate} from 'core-decorators';

import {display} from '../util-styles';

@observer
class TreeFinder extends Component {
  @observable selectedItem = (() => {
    return this.props.codes['_default'].treePath;
  })();

  @computed get selectedContent() {
    return this.props.codes[this.selectedItem];
  }

  render() {
    const files = Object.keys(this.props.codes);
    const fileTreeItems = files.map(file => {
      if (file === '_default') {
        return;
      }

      return (
        <li className="finder__item"
          onClick={this.selectItem(file)}>{file}</li>
      );
    });

    return (
      <div className="code__block">
        <ul className="code__tree finder__list">
          {fileTreeItems}
        </ul>
        <div className="code__content">
          {this.createLineNumberContent(this.selectedContent)}
          <pre className="code__pre">
            <code className="code__code">{this.selectedContent}</code>
          </pre>
        </div>
      </div>
    );
  }

  @autobind
  selectItem(treePath) {
    return () => {
      if (this.selectedItem !== treePath) {
        this.selectedItem = treePath;
      }
    };
  }

  @decorate(memoize)
  createLineNumberContent(content) {
    const length = content.split('\n').length;
    const inner = times(length, num => {
      return <span className="code__line-index">{num + 1}</span>
    });
    return (
      <div className="code__line-number">{inner}</div>
    );
  }
}

TreeFinder.propTypes = {
  code: PropTypes.string
};

TreeFinder.defaultProps = {
  code: 'Not found'
}

export default TreeFinder;
