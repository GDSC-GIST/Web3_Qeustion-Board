import Viewer from './Viewer';
import 'bootstrap/dist/css/bootstrap.css';

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
