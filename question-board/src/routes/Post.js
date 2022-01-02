import { useEffect, useState } from 'react';
import { dbService } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TextEditor from '../components/textEditor/TextEditor'
import Viewer from '../components/viewer/Viewer';
import AnswerViewer from '../components/viewer/AnswerViewer';
import CommentViewer from '../components/viewer/CommentViewer';

const Post = ({ questionId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [questionObj, setQuestionObj] = useState({});

  useEffect(() => {
    const getQuestion = async () => {
      const questionRef = doc(dbService, `question/${questionId}`);
      const newQuestionObj = (await getDoc(questionRef)).data();
  
      setQuestionObj({ ...newQuestionObj });
      setDataFetched(true);
    };

    getQuestion();
  }, [questionId, dataFetched]);

  return (
    <>
      <div>
        <Viewer type='question' postId={questionId} />
        {dataFetched ? (
          questionObj.comments.length ? 
            <CommentViewer comments={questionObj.comments} /> : 
            <></>) : 
          <></>
        }
        <TextEditor type='qComment' />
      </div>

      <div>
        {dataFetched ? (
          questionObj.answers.length ?
            questionObj.answers.map((answerId) => 
              <>
                <AnswerViewer answerId={answerId} key={answerId}/>
                <TextEditor type='comment' key={'TextEditor'+answerId}/>
              </>
            ) : <></>) : 
          <></>
        }
      </div>

      <TextEditor type='answer' />
    </>
  );
};  

export default Post;