import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { contentTest, postTest } from '../../modules/contentTest';
import { addAnswer, addPost } from '../../modules/addPost';

const StyleEditor = ({ type }) => {
  // initialize editor
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  // key command
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  // handle undo and redo
  const disableUndo = (editorState.getUndoStack().size <= 0);
  const disableRedo = (editorState.getRedoStack().size <= 0);

  const onUndoClick = () => {
    onChange(EditorState.undo(editorState));
  };

  const onRedoClick = () => {
    onChange(EditorState.redo(editorState));
  };

  // inline text styling(toggle
  const onBoldClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  // cancel
  const onCancel = (type) => {
    const cancel = window.confirm('작성을 취소하시겠습니까?\n지금까지 작성한 내용은 저장되지 않습니다.');

    if (cancel) {
      switch (type) {
        case 'answer':
          setEditorState(EditorState.createEmpty());
          break;
  
        case 'post':
          setEditorState(EditorState.createEmpty());
          console.log('이전 페이지로 이동');
          break;
        
        default:
          setEditorState(EditorState.createEmpty());
      }
    }
  };

  // submit
  const onSubmit = (type) => {
    switch (type) {
      case 'answer':
        if (contentTest(editorState)) {
          addAnswer(editorState);
          setEditorState(EditorState.createEmpty());
        }
        break;
      
      case 'post':
        if (postTest(editorState)) {
          addPost(editorState);
        }
        break;
      
      default:
        console.log('잘못된 글 타입');
    }
  };

  return (
    <>
      <button onClick={onBoldClick}>
        bold
      </button>
      <button onClick={onItalicClick}>
        italic
      </button>

      <button
        disabled={disableUndo} 
        onClick={onUndoClick}>
          undo
      </button>
      <button 
        disabled={disableRedo} 
        onClick={onRedoClick}>
        redo
      </button>

      <Editor
        placeholder='내용을 입력하세요'
        editorState={editorState}
        onChange={onChange}
        handleKeyCommand={handleKeyCommand}
      />

      <button onClick={() => onCancel(type)}>
        cancel
      </button>
      <button onClick={() => onSubmit(type)}>
        submit
      </button>
    </>
  );
};

StyleEditor.defaultProps = {
  type: null,
}

export default StyleEditor;
