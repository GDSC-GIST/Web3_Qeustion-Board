import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Post from '../routes/Post'

const Router = ({ questionId }) => {
  <BrowserRouter>
    <Routes>
      <Route path={`/questions/${questionId}`} element={<Post questionId={questionId} />} />
    </Routes>
  </BrowserRouter>
};

export default Router;