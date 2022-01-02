import { useState } from 'react';
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../firebase";

const Viewer = ({ type, postId }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const postRef = doc(dbService, `${type}/${postId}`);

  const getContent = async () => {
    const postObj = (await getDoc(postRef)).data();
    const convertedContent = convertFromRaw(postObj.content);

    setEditorState(EditorState.createWithContent(convertedContent));

    if (type === 'question') {
      setTitle(postObj.title);
      setSubject(postObj.subject);
      setGrade(postObj.grade);
    }
  }

  getContent();

  return (
    <>
      { (type === 'question') && (
        <>
          <p>{subject}/{grade}</p>
          <h3>{title}</h3>
        </>
      ) }
      <Editor
        editorState={editorState}
        onChange={onChange}
        readOnly={true} 
      />
    </>
  );
};

export default Viewer;