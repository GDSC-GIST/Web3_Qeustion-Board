import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dbService } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TextEditor from '../components/textEditor/TextEditor'
import PostViewer from '../components/viewer/PostViewer';

const Post = ({ userId = '' }) => {
  const { questionId } = useParams();
  const [dataFetched, setDataFetched] = useState(false);
  const [questionObj, setQuestionObj] = useState({});

  useEffect(() => {
    // data fetch
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
      {window.scrollTo(0, 0)}

      <PostViewer 
        type='question' 
        postId={questionId} 
        userId={userId} 
      />

      <div className='mt-5'>
        <div className='row mb-3'>
          <p className='fs-3'>답변</p>
        </div>
        
        {(dataFetched && questionObj.answers.length) ?
          questionObj.answers.map((answerId) => 
            <PostViewer 
              type='answer' 
              postId={answerId} 
              userId={userId} 
              key={answerId}
            />
          ) : 
          <p className='text-muted'>아직 답변이 없습니다</p>
        }
      </div>

      <div className='mt-5'>
        <TextEditor 
          type='answer' 
          userId={userId} 
          parentId={questionId}
        />
      </div>
    </div>
  );
};  

export default Post;
