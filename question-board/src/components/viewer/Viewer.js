import { useEffect, useState } from 'react';
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { doc, getDoc } from 'firebase/firestore';
import { dbService } from '../../firebase';
import TextEditor from '../textEditor/TextEditor';
import deletePost from '../../modules/deletePost';
import timestampToDate from '../../modules/timestampToDate';
import 'draft-js/dist/Draft.css';
import 'bootstrap/dist/css/bootstrap.css';

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
      document.location.reload(true);
    }
  }

  return (
    <div id={postId}>
      {editing ? <TextEditor type={type} postId={postId}/> :
        <>
          {(type === 'question') ? 
            <>
              <div className='row'>
                {postObj.grade ?
                  <p className=''>
                    {postObj.grade + '/' + postObj.subject }
                  </p> :
                  <></>
                }
              </div>

              <div className='row mb-2'>
                {postObj.title ? 
                  <h3 className='text-start'>
                    {postObj.title}
                  </h3> : 
                  <></>
                }
              </div>
            </> :
            <></>
          }

          <div className='row'>
            <div className='col'>
              {/*유저 프로필 사진과 닉네임*/}

              {postObj.createdAt ? 
                <p className='text-muted'>
                  {timestampToDate(postObj.createdAt)}
                </p> : 
              <></>
              }
            </div>
            
            <div className='col text-end'>
              <button 
                onClick={toggleEdit}
                className='btn btn-light btn-sm'
              >수정</button>{' '}
              <button 
                onClick={onDeleteClick}
                className='btn btn-light btn-sm'
              >삭제</button>
            </div>
          </div>   
        
          {postObj.attachmentUrl ? 
            <img 
              src={postObj.attachmentUrl} 
              alt='' 
              className='img-fluid my-2'
            /> : 
            <></>
          }

          <div className='mb-3'>
            <Editor
              editorState={editorState}
              onChange={onChange}
              readOnly={true} 
            />
          </div>
        </>
      }   
    </div>
  );
};

export default Viewer;