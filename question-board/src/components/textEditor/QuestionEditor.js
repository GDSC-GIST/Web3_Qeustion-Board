import { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { questionTest } from '../../modules/contentTest';
import { addQuestion } from '../../modules/addPost';

const PostEditor = () => {
  // initialize editor
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  // allow key command
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  // handle undo and redo button
  const disableUndo = (editorState.getUndoStack().size <= 0);
  const disableRedo = (editorState.getRedoStack().size <= 0);

  const onUndoClick = () => {
    onChange(EditorState.undo(editorState));
  };

  const onRedoClick = () => {
    onChange(EditorState.redo(editorState));
  };

  // inline text styling
  const onInlineStyleClick = (type) => {
    onChange(RichUtils.toggleInlineStyle(editorState, type));
  };

  // block styling
  const onBlockStyleClick = (type) => {
    onChange(RichUtils.toggleBlockType(editorState, type));
  };

  // cancel
  const onCancel = (event) => {
    const cancel = window.confirm('작성을 취소하시겠습니까?\n지금까지 작성한 내용은 저장되지 않습니다.');

    if (cancel) {
      setEditorState(EditorState.createEmpty());
    } else {
      event.preventDefault();
    }
  };

  // submit
  const onSubmit = (event) => {
    if (questionTest(editorState)) {
      try {
        addQuestion(editorState);
        alert('질문이 게시되었습니다');
        setEditorState(EditorState.createEmpty());
      } catch (error) {
        event.preventDefault();
        console.log(error);
      }
      
    } else {
      event.preventDefault();
    }
  };
  
  return (
    <>
      <form onSubmit={onSubmit} className='postEditor'>
        <div className='subjectSelect'>
          <select id='questionSubject'>
            <option value='subject' defaultValue>과목 선택</option>
            <option value='korean'>국어</option>
            <option value='english'>영어</option>
            <option value='mathematics'>수학</option>
            <option value='science'>과학</option>
          </select>
          <input id='questionTitle' type={'text'} placeholder='제목을 입력하세요' />
        </div>

        <div>
          <input
            type='button'
            value='NORMAL'
            onClick={() => onBlockStyleClick('unstyled')}
          />
          <input
            type='button'
            value='H1'
            onClick={() => onBlockStyleClick('header-one')}
          />
          <input
            type='button'
            value='H2'
            onClick={() => onBlockStyleClick('header-two')}
          />
          <input
            type='button'
            value='H3'
            onClick={() => onBlockStyleClick('header-three')}
          />
        </div>

        <div>
          <input
            type='button'
            value='bold'
            onClick={() => onInlineStyleClick('BOLD')}
          />
          <input
            type='button'
            value='italic'
            onClick={() => onInlineStyleClick('ITALIC')}
          />
          <input
            type='button'
            value='underline'
            onClick={() => onInlineStyleClick('UNDERLINE')}
          />
          <input
            type='button'
            value='code'
            onClick={() => onInlineStyleClick('CODE')}
          />
        </div>

        <div className='styleButton'>
          <input
            type='button'
            value='undo'
            disabled={disableUndo} 
            onClick={onUndoClick}
          />
          <input
            type='button'
            value='redo'
            disabled={disableRedo} 
            onClick={onRedoClick}
          />
        </div>
      
        <Editor
          placeholder='내용을 입력하세요'
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
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
    </>
  );
}

export default PostEditor;
