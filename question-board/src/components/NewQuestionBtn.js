import { BrowserRouter, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const NewQuestionBtn = () => {
  
  return (
    <BrowserRouter>
      <Link to='/new-question'>
        <button 
          type='button' 
          className='btn btn-primary btn-sm'
        >질문하기</button>
      </Link>
    </BrowserRouter>
  );
};

export default NewQuestionBtn;
