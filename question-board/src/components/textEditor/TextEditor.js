import AnswerEditor from './AnswerEditor';
import CommentEditor from './CommentEditor'
import QuestionEditor from './QuestionEditor';

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
