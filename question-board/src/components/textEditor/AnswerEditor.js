import { useEffect, useState } from 'react';
import { dbService } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore';
import { Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';
import { contentTest } from '../../modules/contentTest';
import { addAnswer } from '../../modules/addPost';
import { updateAnswer } from '../../modules/updatePost';
import 'draft-js/dist/Draft.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../../index.css'

// 답변용 텍스트 에디터
const AnswerEditor = ({ userId = '', answerId = '', parentId = '' }) => {
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
    document.getElementById('answerAttachment').value = '';
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
    event.preventDefault();

    const cancel = window.confirm('취소하시겠습니까?');

    if (cancel) {
      if (answerId) {
        // 수정을 취소한 경우 새로고침
        document.location.reload();
      } else {
        // 작성을 취소한 경우 첨부파일과 텍스트창 비우기
        setEditorState(EditorState.createEmpty());
        setAttachment('');
        document.getElementById('answerAttachment').value = '';
      }
    }
  };

  // submit
  const onSubmit = async (event) => {
    event.preventDefault();

    if (contentTest(editorState)) {
      if (answerId) { 
        // 수정하는 경우 수정 사항 업로드
        await updateAnswer(answerId, editorState, attachment);
        alert('답변이 수정되었습니다');

        // 페이지 새로고침
        document.location.reload(true);
      } else { 
        // 새로 작성하는 경우 firestore에 업로드
        await addAnswer(userId, parentId, editorState, attachment);
        alert('답변이 게시되었습니다');

        // 페이지 새로고침
        document.location.reload(true);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className='col justify-content-center'>
      <div className='row row-col-2 my-2'>
        <div className='col'>
          <input 
            id='answerAttachment' 
            type='file' 
            accept='image/*' 
            onChange={onAttachChange} 
            className='form-control form-control-sm'
          />
        </div>
        
        {attachment ? 
          <div className='col-2 text-end'>
            <button 
              onClick={onAttachRemove} 
              className='btn btn-light btn-sm'
            >삭제</button>
          </div> : 
          <></>
        }
      </div>

      {attachment ? 
        <div className='row row-col-2 my-2'>
          <div className='col-3 align-self-start'></div>
          <div className='col-6 align-self-center'>
            <img 
              src={attachment} 
              alt='' 
              className='img-thumbnail' 
            />
          </div>
        </div> : 
        <></>
      }

      <div className='btn-toolbar' role='toolbar' aria-label='text editor toolbar'>
        <div className='btn-group btn-group-sm' role='group' aria-label='block style'>
          <button
            onMouseDown={(event) => onBlockStyleClick(event, 'unstyled')}
            className='btn btn-light'
          >NORMAL</button>

          <button
            onMouseDown={(event) => onBlockStyleClick(event, 'header-one')}
            className='btn btn-light'
          >H1</button>

          <button
            onMouseDown={(event) => onBlockStyleClick(event, 'header-two')}
            className='btn btn-light'
          >H2</button>
          
          <button
            onMouseDown={(event) => onBlockStyleClick(event, 'header-three')}
            className='btn btn-light'
          >H3</button>
        </div>

        <div className='btn-group btn-group-sm' role='group' aria-label='inline style'>
          <button
            onMouseDown={(event) => onInlineStyleClick(event, 'BOLD')}
            className='btn btn-light'
          >BOLD</button>

          <button
            onMouseDown={(event) => onInlineStyleClick(event, 'ITALIC')}
            className='btn btn-light'
          >ITALIC</button>

          <button
            onMouseDown={(event) => onInlineStyleClick(event, 'UNDERLINE')}
            className='btn btn-light'
          >UNDERLINE</button>

          <button
            onMouseDown={(event) => onInlineStyleClick(event, 'CODE')}
            className='btn btn-light'
          >CODE</button>
        </div>

        <div className='btn-group btn-group-sm' role='group' aria-label='undo redo'>
          <button
            onClick={onUndoClick}
            disabled={editorState.getUndoStack().size <= 0} 
            className='btn btn-light'
          >UNDO</button>

          <button
            onClick={onRedoClick}
            disabled={editorState.getRedoStack().size <= 0} 
            className='btn btn-light'
          >REDO</button>
        </div>
      </div>
    
      <div className='text-box-border my-2'>
        <div className='text-box-overflow'>
          <Editor
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
            placeholder='내용을 입력하세요'
          />
        </div>
        
      </div>
      

      <div className='text-center my-2'>
        <input
          type='reset'
          value='취소'
          onClick={onCancel}
          className='btn btn-light'
        />{' '}

        <input
          type='submit'
          value='답변하기'
          className='btn btn-primary'
        />
      </div>
    </form>
  );
};

export default AnswerEditor;
