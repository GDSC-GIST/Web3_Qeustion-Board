import { dbService } from '../firebase'
import { collection, addDoc } from 'firebase/firestore';
import { convertToRaw } from 'draft-js';

const addPost = (editorState) => {
  const subject = document.getElementById('postSubject').value;
  const postTitle = document.getElementById('postTitle').value.trim();
  const postContent = editorState.getCurrentContent();

  const postObj = {
    type: 'post',
    subject: subject,
    title: postTitle,
    content: convertToRaw(postContent),
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
    commentList: [],
    answerList: [],
  };

  addDoc(collection(dbService, 'post'), postObj);
};

const addAnswer = (editorState) => {
  const answerContent = editorState.getCurrentContent();

  const answerObj = {
    type: 'answer',
    postId: null,
    content: convertToRaw(answerContent),
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
    commentList: [],
  };
  addDoc(collection(dbService, 'answer'), answerObj);
};

const addComment = (editorState) => {
  const commentContent = editorState.getCurrentContent();

  const commentObj = {
    type: 'comment',
    postId: null,
    content: convertToRaw(commentContent),
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
  };

  addDoc(collection(dbService, 'comment'), commentObj);
};

export { addPost, addAnswer, addComment };
