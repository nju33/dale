import React from 'react';
import {render} from 'react-dom';
import Hello from './components/Hello';

if (module.hot) {
  module.hot.accept();
}

render(
  <Hello />,
  document.getElementById('demo')
);
