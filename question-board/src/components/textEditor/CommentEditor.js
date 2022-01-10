import { useEffect, useState } from 'react';
import { dbService } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { contentTest } from '../../modules/contentTest';
import { addComment } from '../../modules/addPost';
import { updateComment } from '../../modules/updatePost';
import 'draft-js/dist/Draft.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../../index.css'

// 댓글용 텍스트 에디터
const CommentEditor = ({ userId = '', commentId = '', parentId = '' }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    // data fetch
    const getData = async () => {
      const commentRef = doc(dbService, `comment/${commentId}`);
      const commentObj = (await getDoc(commentRef)).data();

      setEditorState(EditorState.createWithContent(
        convertFromRaw(commentObj.content)
      ));

      setDataFetched(true);
    };

    // 수정하는 경우 data fetch
    if (commentId) {
      getData();
    }
  }, [commentId, dataFetched]);

  const onCancel = (event) => {
    event.preventDefault();

    const cancel = window.confirm('취소하시겠습니까?');

    if (cancel) {
      if (commentId) { 
        // 수정을 취소한 경우 새로고침
        document.location.reload();
      } else {
        // 작성을 취소한 경우 텍스트창 비우기
        setEditorState(EditorState.createEmpty());
      }
    } else {
      event.preventDefault();
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    if (contentTest(editorState)) {
      if (commentId) { 
        // 수정하는 경우 수정 사항 업로드
        await updateComment(commentId, editorState);
        alert('댓글이 수정되었습니다');

        // 페이지 새로고침
        document.location.reload(true);
      } else { 
        // 새로 작성하는 경우 firestore에 업로드
        await addComment(userId, parentId, editorState);
        alert('댓글이 게시되었습니다');

        // 페이지 새로고침
        document.location.reload(true);
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className='col'>
      <div className='text-box-border-sm my-2'>
        <div className='text-box-overflow'>
          <Editor
            placeholder='내용을 입력하세요'
            editorState={editorState}
            onChange={setEditorState}
          />
        </div>
      </div>
      

      <div className='text-end my-2'>
        <input 
          type='reset'
          value='취소'
          onClick={onCancel}
          className='btn btn-light btn-sm'
        />{' '}
        <input
          type='submit'
          value='댓글 달기'
          className='btn btn-primary btn-sm'
        />
      </div>
    </form>
  );
};

export default CommentEditor;
