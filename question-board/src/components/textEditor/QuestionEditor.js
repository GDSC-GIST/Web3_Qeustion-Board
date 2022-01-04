import { useEffect, useState } from 'react';
import { dbService } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore';
import { Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { questionTest } from '../../modules/contentTest';
import { addQuestion } from '../../modules/addPost';
import { updateQuestion } from '../../modules/updatePost';

const QuestionEditor = ({ questionId = null }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [attachment, setAttachment] = useState('');

  useEffect(() => {
    // data fetch
    const getData = async () => {
      const questionRef = doc(dbService, `question/${questionId}`);
      const questionObj = (await getDoc(questionRef)).data();

      setEditorState(EditorState.createWithContent(
        convertFromRaw(questionObj.content)
      ));
      document.getElementById('grade').value = questionObj.grade;
      document.getElementById('subject').value = questionObj.subject;
      document.getElementById('questionTitle').value = questionObj.title;
      setAttachment(questionObj.attachmentUrl);

      setDataFetched(true);
    };

    // 수정하는 경우 data fetch
    if (questionId) {
      getData();
    }
  }, [questionId, dataFetched])

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

  // handle editor state change
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

    const cancel = window.confirm('작성을 취소하시겠습니까?\n지금까지 작성한 내용은 저장되지 않습니다.');

    if (cancel) {
      if (questionId) {
        //새로고침
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  };

  // submit
  const onSubmit = async (event) => {
    event.preventDefault();

    if (questionId && questionTest(editorState)) { // 수정하는 경우
      await updateQuestion(questionId, editorState, attachment);
      alert('질문이 수정되었습니다');

    } else if (questionTest(editorState)) { // 새로 만드는 경우
      await addQuestion(editorState, attachment);
      alert('질문이 게시되었습니다');
      // 질문 페이지로 연결
    }
  };
  
  return (
    <>
      <form onSubmit={onSubmit} className='postEditor'>
        <div className='select'>
          <select id='grade'>
            <option value='' defaultValue>과정 선택</option>
            <option value='초등'>초등</option>
            <option value='중등'>중등</option>
          </select>
          <select id='subject'>
            <option value='' defaultValue>과목 선택</option>
            <option value='국어'>국어</option>
            <option value='영어'>영어</option>
            <option value='수학'>수학</option>
            <option value='과학'>과학</option>
          </select>
          <input 
            id='questionTitle' 
            type='text'
            placeholder='제목을 입력하세요'
          />
        </div>

        <div className='attachButton'>
          <input 
            id='questionAttachment' 
            type='file' 
            accept='image/*' 
            onChange={onAttachChange} 
          />
          <input 
            type='button' 
            value='삭제' 
            onClick={onAttachRemove} 
            disabled={!attachment} 
            className='negativeButton'
          />
        </div>

        <div className='styleButton'>
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

        <div className='styleButton'>
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

        <div>
          <input
            type='reset'
            value='취소'
            onClick={onCancel}
            className='negativeButton'
          />
          <input
            type='submit'
            value='질문하기'
            className='positiveButton'
          />
        </div>
      </form>
    </>
  );
};

export default QuestionEditor;
