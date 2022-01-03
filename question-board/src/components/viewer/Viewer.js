import { useEffect, useState } from 'react';
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { doc, getDoc } from 'firebase/firestore';
import { dbService } from '../../firebase';

const Viewer = ({ type, postId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [postObj, setPostObj] = useState({});

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  useEffect(() => {
    const getData = async () => {
      const postRef = doc(dbService, `${type}/${postId}`);
      const newPostObj = (await getDoc(postRef)).data();
      setPostObj({ ...newPostObj });
  
      const convertedContent = convertFromRaw(newPostObj.content);
      setEditorState(EditorState.createWithContent(convertedContent));

      setDataFetched(true);
    };
  
    getData();
  }, [type, postId, dataFetched]);

  return (
    <>
      {(type === 'question') ? (
        <>
          <p>{postObj.subject}/{postObj.grade}</p>
          <h3>{postObj.title}</h3>
        </>
      ) : <></>}
      {postObj.attachmentUrl ? <img src={postObj.attachmentUrl} alt='' width='300px'/> : <></>}
      <Editor
        editorState={editorState}
        onChange={onChange}
        readOnly={true} 
      />
    </>
  );
};

export default Viewer;