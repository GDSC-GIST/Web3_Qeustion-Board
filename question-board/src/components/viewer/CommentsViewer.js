import Viewer from './Viewer';

const CommentsViewer = ({ comments }) => {
  return (
    <>
      {comments.map((commentId) => 
        <Viewer type='comment' postId={commentId} key={commentId} />)
      }
    </>
  );
};

export default CommentsViewer;
