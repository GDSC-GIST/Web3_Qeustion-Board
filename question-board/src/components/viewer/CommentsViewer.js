import Viewer from './Viewer';
import 'bootstrap/dist/css/bootstrap.css';

// 댓글들 렌더
const CommentsViewer = ({ comments }) => {
  return (
    <>
      {comments.map((commentId) => 
        <div key={commentId}>
          <hr className='text-muted'></hr>
          <Viewer type='comment' postId={commentId} />
        </div>)
      }
    </>
  );
};

export default CommentsViewer;
