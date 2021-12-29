import { useState } from 'react';
import { dbService, storageService } from '../../firebase'
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { v4 } from 'uuid';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { questionTest } from '../../modules/contentTest';

const QuestionEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [attachment, setAttachment] = useState('');

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

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
  const onSubmit = async (event) => {
    event.preventDefault();

    if (questionTest(editorState)) {
      const questionObj = {
        type: 'question',
        subject: document.getElementById('questionSubject').value,
        title: document.getElementById('questionTitle').value.trim(),
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        attachmentUrl: null,
        isAnswered: false,
        createdAt: Date.now(),
        editedAt: null,
        userId: null,  // 나중에 유저 아이디 추가
        commentList: [],
        answerList: [],
      };
        
      const question = await addDoc(collection(dbService, 'question'), questionObj);
      
      if (attachment) {
        const attachmentRef = ref(storageService, `${v4()}`);
        await uploadString(attachmentRef, attachment, 'data_url');
        const attachmentUrl = await getDownloadURL(attachmentRef);
        
        await updateDoc(question, {
          attachmentUrl: attachmentUrl,
        });
      }

      alert('질문이 게시되었습니다');
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
          <input id='questionTitle' type='text' placeholder='제목을 입력하세요' />
        </div>

        <div>
          <input id='questionAttachment' type='file' accept='image/*' onChange={onAttachChange} />
          {attachment && (
            <input type='button' onClick={onAttachRemove} />
          )}
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

export default QuestionEditor;