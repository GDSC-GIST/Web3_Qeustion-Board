import { useEffect, useState } from 'react';
import { dbService } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { contentTest } from '../../modules/contentTest';
import { addComment } from '../../modules/addPost';
import { updateComment } from '../../modules/updatePost';

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

    if (commentId && contentTest(editorState)) {
      await updateComment(commentId, editorState);
      alert('댓글이 수정되었습니다');

      setEditorState(EditorState.createEmpty());
      // 원래 페이지 리다이렉트
    } else if (contentTest(editorState)) {
      await addComment(parentId, editorState);
      alert('댓글이 게시되었습니다');

      setEditorState(EditorState.createEmpty());
      // 원래 페이지 리다이렉트
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className='commentEditor'>
        <Editor
          placeholder='내용을 입력하세요'
          editorState={editorState}
          onChange={setEditorState}
        />

        <input
          type='reset'
          value='취소'
          onClick={onCancel}
        />
        <input
          type='submit'
          value='댓글 달기'
        />
      </form>
    </>
  );
};

export default CommentEditor;
