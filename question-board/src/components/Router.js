import { BrowserRouter, Route, Routes } from "react-router-dom";
import Post from '../routes/Post'
import NewQuestion from '../routes/NewQuestion'

const Router = ({ userId = '' }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/posts/:questionId' element={<Post userId={userId} />} />
        <Route path='/new-question' element={<NewQuestion userId={userId} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
