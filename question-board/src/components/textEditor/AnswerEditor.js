import { useEffect, useState } from 'react';
import { dbService } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore';
import { Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { contentTest } from '../../modules/contentTest';
import { addAnswer } from '../../modules/addPost';
import { updateAnswer } from '../../modules/updatePost';
import Viewer from '../viewer/Viewer';

const AnswerEditor = ({ answerId = null, parentId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [attachment, setAttachment] = useState('');

  useEffect(() => {
    // fetch data
    const getData = async () => {
      const answerRef = doc(dbService, `answer/${answerId}`);
      const answerObj = (await getDoc(answerRef)).data();

      setEditorState(EditorState.createWithContent(
        convertFromRaw(answerObj.content)
      ));
      setAttachment(answerObj.attachmentUrl);

      setDataFetched(true);
    };

    // 수정하는 경우 data fetch
    if (answerId) {
      getData();
    }
  }, [answerId, dataFetched]);

  // handle change on editor state
  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  // handle attachment
  const onAttachChange = (event) => {
    const { target: { files } } = event;
    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setAttachment(result);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  };

  const onAttachRemove = () => {
    setAttachment('');
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

  // handle undo and redo
  const onUndoClick = () => {
    onChange(EditorState.undo(editorState));
  };

  const onRedoClick = () => {
    onChange(EditorState.redo(editorState));
  };

  // inline text styling
  const onInlineStyleClick = (event, type) => {
    event.preventDefault();
    onChange(RichUtils.toggleInlineStyle(editorState, type));
  };

  // block styling
  const onBlockStyleClick = (event, type) => {
    event.preventDefault();
    onChange(RichUtils.toggleBlockType(editorState, type));
  };

  // cancel
  const onCancel = (event) => {
    const cancel = window.confirm('작성을 취소하시겠습니까?\n지금까지 작성한 내용은 저장되지 않습니다.');

    if (cancel) {
      onChange(EditorState.createEmpty());
    } else {
      event.preventDefault();
    }
  };

  // submit
  const onSubmit = async (event) => {
    event.preventDefault();

    if (answerId && contentTest(editorState)) {
      await updateAnswer(answerId, editorState, attachment);
      alert('답변이 수정되었습니다');

      setEditorState(EditorState.createEmpty());
      setAttachment('');
    } else if (contentTest(editorState)) {
      await addAnswer(parentId, editorState, attachment);
      alert('답변이 게시되었습니다');

      setEditorState(EditorState.createEmpty());
      setAttachment('');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <input id='questionAttachment' type='file' accept='image/*' onChange={onAttachChange} />
          {attachment && (
            <input type='button' value='삭제' onClick={onAttachRemove} />
          )}
        </div>

        <div>
          <input
            type='button'
            value='NORMAL'
            onMouseDown={(event) => onBlockStyleClick(event, 'unstyled')}
          />
          <input
            type='button'
            value='H1'
            onMouseDown={(event) => onBlockStyleClick(event, 'header-one')}
          />
          <input
            type='button'
            value='H2'
            onMouseDown={(event) => onBlockStyleClick(event, 'header-two')}
          />
          <input
            type='button'
            value='H3'
            onMouseDown={(event) => onBlockStyleClick(event, 'header-three')}
          />
        </div>

        <div>
          <input
            type='button'
            value='bold'
            onMouseDown={(event) => onInlineStyleClick(event, 'BOLD')}
          />
          <input
            type='button'
            value='italic'
            onMouseDown={(event) => onInlineStyleClick(event, 'ITALIC')}
          />
          <input
            type='button'
            value='underline'
            onMouseDown={(event) => onInlineStyleClick(event, 'UNDERLINE')}
          />
          <input
            type='button'
            value='code'
            onMouseDown={(event) => onInlineStyleClick(event, 'CODE')}
          />
        </div>

        <div className='styleButton'>
          <input
            type='button'
            value='undo'
            disabled={editorState.getUndoStack().size <= 0} 
            onClick={onUndoClick}
          />
          <input
            type='button'
            value='redo'
            disabled={editorState.getRedoStack().size <= 0} 
            onClick={onRedoClick}
          />
        </div>

        <div className='attachment'>
          {attachment ? <img src={attachment} alt='' width='400px' /> : <></>}
        </div>
      
        <Editor
          placeholder='내용을 입력하세요'
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
        />

        <input
          type='reset'
          value='취소'
          onClick={onCancel}
        />
        <input
          type='submit'
          value='답변하기'
        />
      </form>
    </>
  );
};

export default AnswerEditor;
