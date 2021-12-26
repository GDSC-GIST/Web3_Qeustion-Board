import { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { contentTest } from '../../modules/contentTest';
import { addComment } from '../../modules/addPost';

const CommentEditor = () => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const onCancel = () => {
    const cancel = window.confirm('작성을 취소하시겠습니까?\n지금까지 작성한 내용은 저장되지 않습니다.');

    if (cancel) {
      setEditorState(EditorState.createEmpty());
    }
  }

  const onSubmit = () => {
    if (contentTest(editorState)) {
      addComment(editorState);
      setEditorState(EditorState.createEmpty());
    }
  };

  return (
    <>
      <Editor
        placeholder='내용을 입력하세요'
        editorState={editorState}
        onChange={onChange}
      />

      <button onClick={onCancel}>
        cancel
      </button>
      <button onClick={onSubmit}>
        submit
      </button>
    </>
  )
};

export default CommentEditor;
