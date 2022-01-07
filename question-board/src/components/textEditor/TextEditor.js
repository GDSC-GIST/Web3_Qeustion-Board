import AnswerEditor from './AnswerEditor';
import CommentEditor from './CommentEditor'
import QuestionEditor from './QuestionEditor';

// 타입에 따른 텍스트 에디터 불러옴
// postId는 수정하는 경우에만 필요
// parentId는 type: answer, comment에 필수
const TextEditor = ({ type, postId = null, parentId = null }) => {
  switch (type) {
    case 'question':
      return (
        <QuestionEditor questionId={postId} />
      );
      
    case 'answer':
      return (
        <AnswerEditor answerId={postId} parentId={parentId}/>
      );
    
    case 'comment':
      return (
        <CommentEditor commentId={postId} parentId={parentId} />
      );
    
    default:
      return null;
  }
};

export default TextEditor;
