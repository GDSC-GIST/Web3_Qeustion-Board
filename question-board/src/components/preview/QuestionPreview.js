import { useEffect, useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { dbService } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.css';
import '../../style.css';

// 질문 미리보기(링크)
const QuestionPreview = ({ questionId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [questionObj, setQuestionObj] = useState({});

  useEffect(() => {
    // data fetch
    const getData = async () => {
      const questionRef = doc(dbService, `question/${questionId}`);
      const newQuestionObj = (await getDoc(questionRef)).data();
      setQuestionObj(newQuestionObj);
      
      setDataFetched(true);
    };

    getData();
  }, [questionId, dataFetched]);

  return (
    <BrowserRouter>
      <Link to={`/post/${questionId}`} className='description' style={{textDecoration: 'none', textAlign: 'left'}}>
        {dataFetched ? 
          <>
            <span style={{marginRight: '30px'}}>{questionObj.grade}/{questionObj.subject}</span>
            <span>{questionObj.title}</span>
          </> :
          <></>
        }
      </Link>
    </BrowserRouter>
  );
};

export default QuestionPreview;
