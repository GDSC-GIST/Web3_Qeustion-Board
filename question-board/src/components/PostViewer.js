import { EditorState } from "draft-js";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../firebase";

const PostViewer = ({ subject, postId }) => {
  const postObj = getDoc(doc(dbService, `${subject}/${postId}`));

  return (
    <Editor
      editorState={EditorState.createWithContent(postObj.content)}
      readOnly={true} 
    />
  )
};

export default PostViewer;