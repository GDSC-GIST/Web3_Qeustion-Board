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

const CommentEditor = ({ commentId = null, parentId }) => {
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
    const cancel = window.confirm('취소하시겠습니까?');

    if (cancel) {
      if (commentId) { // 수정하는 경우
        setEditorState(EditorState.createEmpty());
        // 새로고침

      } else {
        setEditorState(EditorState.createEmpty());
      }
    } else {
      event.preventDefault();
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    if (contentTest(editorState)) {
      if (commentId) { // 수정하는 경우
        await updateComment(commentId, editorState);
        alert('댓글이 수정되었습니다');
        document.location.reload(true);
      } else { // 새로 만드는 경우
        await addComment(parentId, editorState);
        alert('댓글이 게시되었습니다');
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
