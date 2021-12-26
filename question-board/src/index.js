import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TextEditor from './components/textEditor/TextEditor';

ReactDOM.render(
  <React.StrictMode>
    <TextEditor type='post' />
  </React.StrictMode>,
  document.getElementById('root')
);
