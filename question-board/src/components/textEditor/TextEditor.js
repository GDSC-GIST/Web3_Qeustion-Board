import AnswerEditor from './AnswerEditor';
import QuestionEditor from './QuestionEditor';
import CommentEditor from './CommentEditor'


const TextEditor = ({type, parentId}) => {
  switch (type) {
    case 'question':
      return (
        <QuestionEditor />
      );
      
    case 'answer':
      return (
        <AnswerEditor parentId={parentId}/>
      );
    
    case 'qComment':
      return (
        <CommentEditor type='question' parentId={parentId} />
      );

    case 'aComment':
      return (
        <CommentEditor type='answer' parentId={parentId} />
      );
    
    default:
      return null;
  }
};

export default TextEditor;
