import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import QuestionEditor from './components/textEditor/QuestionEditor';
import AnswerEditor from './components/textEditor/AnswerEditor'
import CommentEditor from './components/textEditor/CommentEditor'

ReactDOM.render(
  <React.StrictMode>
    <CommentEditor type='answer' parentId='WYRhS4GY7dbff5AKF5Mj' />
  </React.StrictMode>,
  document.getElementById('root')
);
