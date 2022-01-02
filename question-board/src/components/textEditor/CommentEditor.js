import { useState } from 'react';
import { dbService } from '../../firebase'
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Editor, EditorState, convertToRaw  } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { contentTest } from '../../modules/contentTest';



const CommentEditor = ({ type, parentId }) => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );

  const onCancel = (event) => {
    const cancel = window.confirm('작성을 취소하시겠습니까?\n지금까지 작성한 내용은 저장되지 않습니다.');

    if (cancel) {
      setEditorState(EditorState.createEmpty());
    } else {
      event.preventDefault();
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    if (contentTest(editorState)) {
      let parentRef = null;
      switch (type) {
        case 'question':
          parentRef = doc(dbService, `question/${parentId}`);
          break;
        
        case 'answer':
          parentRef = doc(dbService, `answer/${parentId}`);
          break;
      }

      const parentObj = (await getDoc(parentRef)).data();

      const commentObj = {
        type: 'comment',
        subject: parentObj.subject,
        parentId: parentId,
        parentType: parentObj.type,
        content: convertToRaw(editorState.getCurrentContent()),
        createdAt: Date.now(),
        editedAt: null,
        userId: null,  // 나중에 유저 아이디 추가
      };

      const comment = await addDoc(collection(dbService, 'comment'), commentObj);
      updateDoc(parentRef, {
        comments: [...parentObj.comments, comment.id],
      });
      
      alert('댓글이 게시되었습니다');

      setEditorState(EditorState.createEmpty());
    };
  }

  return (
    <form onSubmit={onSubmit} className='commentEditor'>
      <Editor
        placeholder='내용을 입력하세요'
        editorState={editorState}
        onChange={setEditorState}
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
  )
};

export default CommentEditor;
