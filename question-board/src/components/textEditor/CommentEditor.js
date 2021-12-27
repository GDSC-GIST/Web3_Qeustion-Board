import { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { contentTest } from '../../modules/contentTest';
import { addQuestionComment, addAnswerComment } from '../../modules/addPost';

const CommentEditor = ({ type, parentId }) => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );

  const onCancel = (event) => {
    const cancel = window.confirm('작성을 취소하시겠습니까?\n지금까지 작성한 내용은 저장되지 않습니다.');

    if (cancel) {
      setEditorState(EditorState.createEmpty());
    } else {
      event.preventDefault();
    }
  }

  const onSubmit = (event) => {
    if (contentTest(editorState)) {
      try {
        switch (type) {
          case 'question':
            addQuestionComment(editorState, parentId);
            break;
          
          case 'answer':
            addAnswerComment(editorState, parentId);
            break;
        }
        alert('댓글이 게시되었습니다');
        //setEditorState(EditorState.createEmpty());
      } catch (error) {
        event.preventDefault();
        console.log(error);
      }
    } else {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={onSubmit} className='commentEditor'>
      <Editor
        placeholder='내용을 입력하세요'
        editorState={editorState}
        onChange={setEditorState}
      />

      <input
        type='reset'
        value='cancel'
        onClick={onCancel}
      />
      <input
        type='submit'
        value='submit'
      />
    </form>
  )
};

export default CommentEditor;
