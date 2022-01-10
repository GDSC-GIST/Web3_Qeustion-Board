import { dbService, storageService } from '../firebase';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { convertToRaw } from 'draft-js';
import { v4 } from 'uuid';

// 답변 업로드
const addAnswer = async (userId, parentId, editorState, attachment) => {
  // 유저 정보 가져오기: 유저의 answers(list) 수정해야 함
  const userRef = doc(dbService, `user/${userId}`);
  const userObj = (await getDoc(userRef)).data();

  // 부모 정보 가져오기: 부모의 answers(list) 수정해야 함
  const parentRef = doc(dbService, `question/${parentId}`);
  const parentObj = (await getDoc(parentRef)).data();
  
  let attachmentUrl = ''
  if (attachment) {
    // 첨부파일이 있는 경우 storage에 업로드 후 다운로드 url 가져오기
    const attachmentRef = ref(storageService, `${v4()}`);
    await uploadString(attachmentRef, attachment, 'data_url');
    attachmentUrl = await getDownloadURL(attachmentRef);
  }

  // 업로드할 답변 객체
  const answerObj = {
    type: 'answer',
    parentId: parentId,
    parentType: 'question',
    content: convertToRaw(editorState.getCurrentContent()),
    attachmentUrl: attachmentUrl,
    createdAt: Date.now(),
    editedAt: null,
    userId: userId,  // 나중에 유저 아이디 추가
    comments: [],
  };
  
  // firestore에 업로드
  const newAnswer = await addDoc(collection(dbService, 'answer'), answerObj);

  // 유저의 answers(list) 업데이트
  const updateUser = updateDoc(userRef, {
    answers: [...userObj.answers, newAnswer.id],
  });

  // 부모의 answers(list)와 isAnswered(boolean) 업데이트
  const updateParent = updateDoc(parentRef, {
    isAnswered: true,
    answers: [...parentObj.answers, newAnswer.id],
  });

  // 업데이트가 완료될 때까지 기다림
  await Promise.allSettled([updateUser, updateParent]);
};

// 댓글 업로드
const addComment = async (userId, parentId, editorState) => {
  // 유저 정보 가져오기: 유저의 answers(list) 수정해야 함
  const userRef = doc(dbService, `user/${userId}`);
  const userObj = (await getDoc(userRef)).data();

  // 부모 정보 가져오기: 부모의 answers(list) 수정해야 함
  // 부모의 type에 상관 없이 question과 answer collction에서 ref, obj 가져옴
  const questionRef = doc(dbService, `question/${parentId}`);
  const questionObj = (await getDoc(questionRef)).data();

  const answerRef = doc(dbService, `answer/${parentId}`);
  const answerObj = (await getDoc(answerRef)).data();

  // 부모 객체로 값이 반환된 ref, obj사용
  const parentRef = questionObj ? questionRef : answerRef;
  const parentObj = questionObj ? { ...questionObj } : { ...answerObj };

  // 업로드할 댓글 객체
  const commentObj = {
    type: 'comment',
    parentId: parentId,
    parentType: parentObj.type,
    content: convertToRaw(editorState.getCurrentContent()),
    createdAt: Date.now(),
    editedAt: null,
    userId: userId,  // 나중에 유저 아이디 추가
  };

  // firestore에 업로드
  const newComment = await addDoc(collection(dbService, 'comment'), commentObj);

  // 유저의 comments(list) 업데이트
  const updateUser = updateDoc(userRef, {
    comments: [...userObj.comments, newComment.id]
  })

  // 부모의 comments(list) 업데이트
  const updateParent = updateDoc(parentRef, {
    comments: [...parentObj.comments, newComment.id],
  });

  // 업데이트가 완료될 때까지 기다림
  await Promise.allSettled([updateUser, updateParent]);
}

// 질문 업로드
const addQuestion = async (userId, editorState, attachment) => {
  // 유저 정보 가져오기: 유저의 answers(list) 수정해야 함
  const userRef = doc(dbService, `user/${userId}`);
  const userObj = (await getDoc(userRef)).data();

  let attachmentUrl = ''
  if (attachment) {
    // 첨부파일이 있는 경우 storage에 업로드 후 다운로드 url 가져오기
    const attachmentRef = ref(storageService, `${v4()}`);
    await uploadString(attachmentRef, attachment, 'data_url');
    attachmentUrl = await getDownloadURL(attachmentRef);
  }

  // 업로드할 질문 객체
  const questionObj = {
    type: 'question',
    grade: document.getElementById('grade').value,
    subject: document.getElementById('subject').value,
    title: document.getElementById('questionTitle').value.trim(),
    content: convertToRaw(editorState.getCurrentContent()),
    attachmentUrl: attachmentUrl,
    isAnswered: false,
    createdAt: Date.now(),
    editedAt: null,
    userId: userId,  // 나중에 유저 아이디 추가
    comments: [],
    answers: [],
  };

  // firestore에 업로드
  const newQuestion = await addDoc(collection(dbService, 'question'), questionObj);

  // 유저 정보 업데이트
  await updateDoc(userRef, {
    questions: [...userObj.questions, newQuestion.id]
  });
};

export { addQuestion, addAnswer, addComment };
