import LinkBtn from './LinkBtn';
import 'bootstrap/dist/css/bootstrap.css';

const NewQuestionBtn = ({ userId = '' }) => {
  return (
      <LinkBtn 
        to='/new-question' 
        state={{
          userId: userId,
        }}
        className='btn btn-primary btn-sm'>
        질문하기
      </LinkBtn>
  );
};

export default NewQuestionBtn;
