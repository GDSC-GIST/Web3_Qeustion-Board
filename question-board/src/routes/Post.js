import { doc, getDoc } from "firebase/firestore";
import PostViewer from "../components/PostViewer";
import TextEditor from '../components/textEditor/TextEditor'
import { dbService } from "../firebase";

const Post = ({ postId }) => {
  const postObj = getDoc(doc(dbService, `post/${postId}`));
  const answerList = postObj.answerList;
  const commentList = postObj.commentList;

  return (
    <>
      <div>
        <PostViewer postId={postId} />
        <TextEditor type={'comment'} parentId={postId} />
        <TextEditor type={'answer'} parentId={postId} />
      </div>
      
      
    </>
  );
};

export default Post;