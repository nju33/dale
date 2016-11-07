import React from 'react';
import {render} from 'react-dom';
import TreeView from './components/TreeView';
import Demo from './components/Demo';

if (module.hot) {
  module.hot.accept();
}

render(
  <div className="wrapper">
    <TreeView contents={srcContents}></TreeView>
    <Demo contents={demoContents}></Demo>
  </div>,
  document.getElementById('demo')
);
