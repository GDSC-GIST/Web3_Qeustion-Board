import { useEffect, useState } from 'react';
import { dbService } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TextEditor from '../components/textEditor/TextEditor'
import PostViewer from '../components/viewer/PostViewer';

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
    <div className='col'>
      <PostViewer type='question' postId={questionId} />

      <div className='mt-5'>
        <div className='row mb-3'>
          <h3>답변</h3>
        </div>
        
        {dataFetched ? (
          questionObj.answers.length ?
            questionObj.answers.map((answerId) => 
              <PostViewer type='answer' postId={answerId} key={answerId}/>
            ) : <></>) : 
          <></>
        }
      </div>

      <div className='mt-5'>
        <TextEditor type='answer' />
      </div>
      
    </div>
  );
};  

export default Post;