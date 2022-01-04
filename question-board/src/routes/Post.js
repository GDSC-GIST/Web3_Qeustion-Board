import { useEffect, useState } from 'react';
import { dbService } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TextEditor from '../components/textEditor/TextEditor'
import Viewer from '../components/viewer/Viewer';
import AnswerViewer from '../components/viewer/AnswerViewer';
import CommentsViewer from '../components/viewer/CommentsViewer';

const Post = ({ questionId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [questionObj, setQuestionObj] = useState({});

  useEffect(() => {
    const getData = async () => {
      const questionRef = doc(dbService, `question/${questionId}`);
      const newQuestionObj = (await getDoc(questionRef)).data();
  
      setQuestionObj({ ...newQuestionObj });
      setDataFetched(true);
    };

    getData();
  }, [questionId, dataFetched]);

  return (
    <>
      <div>
        <Viewer type='question' postId={questionId} />
        {dataFetched ? (
          questionObj.comments.length ? 
            <CommentsViewer comments={questionObj.comments} /> : 
            <></>) : 
          <></>
        }
        <TextEditor type='comment' parentId={questionId} />
      </div>

      <div>
        {dataFetched ? (
          questionObj.answers.length ?
            questionObj.answers.map((answerId) => 
              <div key={answerId}>
                <AnswerViewer answerId={answerId} />
                <TextEditor type='comment' parentId={answerId} />
              </div>
            ) : <></>) : 
          <></>
        }
      </div>

      <TextEditor type='answer' parentId={questionId} />
    </>
  );
};  

export default Post;