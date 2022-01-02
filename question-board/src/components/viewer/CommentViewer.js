import Viewer from './Viewer';

const CommentViewer = ({ comments }) => {
  return (
    comments.map((commentId) => <Viewer type='comment' postId={commentId} key={commentId} />)
  );
};

export default CommentViewer;
