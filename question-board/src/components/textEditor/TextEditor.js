import AnswerEditor from './AnswerEditor';
import PostEditor from './PostEditor';
import CommentEditor from './CommentEditor';

const TextEditor  = ({ type }) => {
  switch (type) {
    case "post":
      return (
        <PostEditor />
      );

    case 'answer':
      return (
        <AnswerEditor />
      );

    case 'comment':
      return (
        <CommentEditor />
      );
      
    default:
      return (
        <></>
      );
  }
}

export default TextEditor;
