import { useEffect, useState } from 'react';
import { dbService } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TextEditor from '../textEditor/TextEditor';
import Viewer from './Viewer';
import CommentsViewer from './CommentsViewer';
import 'bootstrap/dist/css/bootstrap.css';
import '../../index.css'

// 질문(또는 답변)과 댓글 렌더
const PostViewer = ({ type = '', postId = '', userId = '' }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      const postRef = doc(dbService, `${type}/${postId}`);
      const postObj = (await getDoc(postRef)).data();
  
      setComments([...postObj.comments]);
      setDataFetched(true);
    };

    getComments();
  }, [postId, dataFetched]);

  return (
    <div className='mb-5'>
      <Viewer 
        type={type} 
        postId={postId} 
        userId={userId}
      />

      {(dataFetched && comments.length) ? 
        <CommentsViewer 
          comments={comments} 
          userId={userId}
        /> : 
        <></>
      }

      <TextEditor 
        type='comment' 
        parentId={postId} 
        userId={userId}
      />
    </div>
  );
};

export default PostViewer;
