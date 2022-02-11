import TextEditor from '../components/textEditor/TextEditor';

const NewQuestion = ({ userId = '' }) => {
  return (
    <>
      {userId ? 
        <TextEditor type='question' userId={userId} /> :
        alert('로그인 후 작성 가능합니다')
        // 로그인 페이지로 이동
      }
    </>
    
  );
};

export default NewQuestion;
