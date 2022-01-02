import { useEffect, useState } from 'react';
import { dbService } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Viewer from './Viewer';
import CommentViewer from './CommentViewer';

const AnswerViewer = ({ answerId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      const answerRef = doc(dbService, `answer/${answerId}`);
      const answerObj = (await getDoc(answerRef)).data();
  
      setComments([...answerObj.comments]);
      setDataFetched(true);
    };

    getComments();
  }, [answerId, dataFetched]);

  return (
    <>
      <Viewer type='answer' postId={answerId} />
      {dataFetched ?
        (comments.length ? <CommentViewer comments={comments} /> : <></>) : 
        <></>
      }
    </>
  );
};

export default AnswerViewer;
