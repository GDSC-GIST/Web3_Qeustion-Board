import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore';
import { Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';
import { questionTest } from '../../modules/contentTest';
import { addQuestion } from '../../modules/addPost';
import { updateQuestion } from '../../modules/updatePost';
import 'draft-js/dist/Draft.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../../index.css' ;

const QuestionEditor = ({ userId = '', questionId = '' }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [attachment, setAttachment] = useState('');
  const navigate = useNavigate();

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
    document.getElementById('questionAttachment').value = '';
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
        // 새로고침
        document.location.reload();
      } else {
        // 이전 페이지로 링크
        navigate(-1);
      }
    }
  };

  // submit
  const onSubmit = async (event) => {
    event.preventDefault();

    if (questionTest(editorState)) {
      if (questionId) { 
        // 수정하는 경우 수정 사항 업로드
        await updateQuestion(questionId, editorState, attachment);
        alert('질문이 수정되었습니다');

        // 페이지 새로고침
        document.location.reload(true);
      } else { 
        // 새로 작성하는 경우 firestore에 업로드
        const newQuestion = await addQuestion(userId, editorState, attachment);
        alert('질문이 게시되었습니다');

        // 질문 페이지로 연결
        navigate(`/post/${newQuestion}`);
      }
    }
  };
  
  return (
    <form onSubmit={onSubmit} className='col'>
      <div className='row row-col-3 my-2'>
        <div className='col-2'>
          <select id='grade' className='form-select form-select-sm'>
            <option value='' defaultValue>과정</option>
            <option value='초등'>초등</option>
            <option value='중등'>중등</option>
          </select>
        </div>
          
        <div className='col-2'>
          <select id='subject'className='form-select form-select-sm'>
            <option value='' defaultValue>과목</option>
            <option value='국어'>국어</option>
            <option value='영어'>영어</option>
            <option value='수학'>수학</option>
            <option value='과학'>과학</option>
            <option value='사회'>사회</option>
          </select>
        </div>

        <div className='col'>
          <input 
            id='questionTitle' 
            type='text'
            placeholder='제목을 입력하세요'
            className='form-control form-control-sm'
          />
        </div>       
      </div>

      <div className='row my-2'>
        <div className='col'>
          <input 
            id='questionAttachment' 
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
          <div className='col-6'>
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
        <div >
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
        </div>

        <div>
          <div className='btn-group btn-group-sm' role='group' aria-label='inline style'>
            <button
              type='button'
              onMouseDown={(event) => onInlineStyleClick(event, 'BOLD')}
              className='btn btn-light'
            >BOLD</button>

            <button
              type='button'
              onMouseDown={(event) => onInlineStyleClick(event, 'ITALIC')}
              className='btn btn-light'
            >ITALIC</button>

            <button
              type='button'
              value='underline'
              onMouseDown={(event) => onInlineStyleClick(event, 'UNDERLINE')}
              className='btn btn-light'
            >UNDERLINE</button>

            <button
              type='button'
              value='code'
              onMouseDown={(event) => onInlineStyleClick(event, 'CODE')}
              className='btn btn-light'
            >CODE</button>
          </div>
        </div>
        
        <div className=''>
          <div className='btn-group btn-group-sm' role='group' aria-label='undo and rdo'>
            <button
              type='button'
              onClick={onUndoClick}
              disabled={editorState.getUndoStack().size <= 0} 
              className='btn btn-light'
            >UNDO</button>

            <button
              type='button'
              onClick={onRedoClick}
              disabled={editorState.getRedoStack().size <= 0} 
              className='btn btn-light'
            >REDO</button>
          </div>
        </div>
      </div>

      <div className='text-box-border mt-2 mb-3'>
        <div className='text-wrap'>
          <Editor
            placeholder='내용을 입력하세요'
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
            className='overflow-auto'
          />
        </div>
      </div>
      

      <div className='text-center mt-3 mb-5'>
          <input
            type='reset'
            value='취소'
            onClick={onCancel}
            className='btn btn-light text-end'
          />{' '}
          <input
            type='submit'
            value='질문하기'
            className='btn btn-primary'
          />         
      </div>
    </form>
  );
};

export default QuestionEditor;
