import React from 'react';
import {render} from 'react-dom';
import TreeView from './components/TreeView';
import Demo from './components/Demo';
import Hello from './components/Hello';

if (module.hot) {
  module.hot.accept();
}

render(
  <div>
    <TreeView></TreeView>
    <Demo></Demo>
  </div>,
  document.getElementById('demo')
);
