import { useEffect, useState } from 'react';
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { doc, getDoc } from 'firebase/firestore';
import { dbService } from '../../firebase';
import TextEditor from '../textEditor/TextEditor';
import deletePost from '../../modules/deletePost';

const Viewer = ({ type, postId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [postObj, setPostObj] = useState({});

  useEffect(() => {
    const getData = async () => {
      const postRef = doc(dbService, `${type}/${postId}`);
      const newPostObj = (await getDoc(postRef)).data();

      setPostObj(newPostObj);
      setEditorState(EditorState.createWithContent(
        convertFromRaw(newPostObj.content)
      ));

      setDataFetched(true);
    };
  
    getData();
  }, [type, postId, dataFetched]);

  // handle change on editor state
  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  // handle edit
  const toggleEdit = () => {
    setEditing((prev) => !prev);
  }

  // handle delete
  const onDeleteClick = async () => {
    const deleteConfirm = window.confirm('삭제하시겠습니까?');

    if (deleteConfirm) {
      await deletePost(type, postId);
      alert('삭제되었습니다');
      // 새로고침
    }
  }

  return (
    <>
      {editing ? <TextEditor type={type} postId={postId}/> :
        <>
          {(type === 'question') ? (
            <>
              {postObj.grade ? <p>{postObj.grade + '/' + postObj.subject}</p> : <></>}
              {postObj.grade ? <p>{postObj.title}</p> : <></>}

              <div>
                <button onClick={toggleEdit}>수정</button>
                <button onClick={onDeleteClick}>삭제</button>
              </div>
            </>) : 
            <></>
          }
    
          {postObj.attachmentUrl ? <img src={postObj.attachmentUrl} alt='' width='300px'/> : <></>}
          
          <Editor
            editorState={editorState}
            onChange={onChange}
            readOnly={true} 
          />

          {(type !== 'question') ? 
            <div>
              <button onClick={toggleEdit}>수정</button>
              <button onClick={onDeleteClick}>삭제</button>
            </div> : 
            <></>
          }
        </>
      }
    </>
  );
};

export default Viewer;