import { dbService } from '../firebase'
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { convertToRaw } from 'draft-js';

const addQuestion = (editorState) => {
  const questionObj = {
    type: 'question',
    subject: document.getElementById('questionSubject').value,
    title: document.getElementById('questionTitle').value.trim(),
    content: convertToRaw(editorState.getCurrentContent()),
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
    commentList: [],
    answerList: [],
  };
  
  addDoc(collection(dbService, 'questions'), questionObj);
};

const addAnswer = async (editorState, parentId) => {
  const parentRef = doc(dbService, `questions/${parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  const answerObj = {
    type: 'answer',
    subject: parentObj.subject,
    parentId: parentId,
    content: convertToRaw(editorState.getCurrentContent()),
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
    commentList: [],
  };

  const answer = await addDoc(collection(dbService, 'answers'), answerObj);
  updateDoc(parentRef, {
    answerList: [...parentObj.answerList, answer.id],
  });
};

const addQuestionComment = async (editorState, parentId) => {
  const parentRef = doc(dbService, `questions/${parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  const commentObj = {
    type: 'comment',
    subject: parentObj.subject,
    parentId: parentId,
    content: convertToRaw(editorState.getCurrentContent()),
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
  };

  const comment = await addDoc(collection(dbService, 'comments'), commentObj);
  updateDoc(parentRef, {
    commentList: [...parentObj.commentList, comment.id],
  });
};

const addAnswerComment = async (editorState, parentId) => {
  const parentRef = doc(dbService, `answers/${parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  const commentObj = {
    type: 'comment',
    subject: parentObj.subject,
    parentId: parentId,
    content: convertToRaw(editorState.getCurrentContent()),
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
  };

  const comment = await addDoc(collection(dbService, 'comments'), commentObj);
  updateDoc(parentRef, {
    commentList: [...parentObj.commentList, comment.id],
  });
};

export { addQuestion, addAnswer, addQuestionComment, addAnswerComment };
