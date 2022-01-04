import { dbService, storageService } from '../firebase';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { convertToRaw } from 'draft-js';
import { v4 } from 'uuid';

const addAnswer = async (parentId, editorState, attachment) => {
  let attachmentUrl = ''
  if (attachment) {
    const attachmentRef = ref(storageService, `${v4()}`);
    await uploadString(attachmentRef, attachment, 'data_url');
    attachmentUrl = await getDownloadURL(attachmentRef);
  }

  // 부모 객체
  const parentRef = doc(dbService, `question/${parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  // 업로드할 답변 객체
  const answerObj = {
    type: 'answer',
    parentId: parentId,
    parentType: 'question',
    content: convertToRaw(editorState.getCurrentContent()),
    attachmentUrl: attachmentUrl,
    createdAt: Date.now(),
    editedAt: null,
    userId: null,  // 나중에 유저 아이디 추가
    comments: [],
  };
  
  const answer = await addDoc(collection(dbService, 'answer'), answerObj);

  // 부모 객체 answers(list)에 추가하고 답변 완료로 수정
  await updateDoc(parentRef, {
    isAnswered: true,
    answers: [...parentObj.answers, answer.id()],
  });

  return answer
};

const addComment = async (parentId, editorState) => {
  const questionRef = doc(dbService, `question/${parentId}`);
  const questionObj = (await getDoc(questionRef)).data();

  const answerRef = doc(dbService, `answer/${parentId}`);
  const answerObj = (await getDoc(answerRef)).data();

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
    userId: null,  // 나중에 유저 아이디 추가
  };

  const comment = await addDoc(collection(dbService, 'comment'), commentObj);

  // 부모 객체의 comments(list) 업데이트
  await updateDoc(parentRef, {
    comments: [...parentObj.comments, comment.id()],
  });

  return comment;
}

const addQuestion = async (editorState, attachment) => {
  let attachmentUrl = ''
  if (attachment) {
    // 첨부파일이 있는 경우 Storage에 업로드
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
    userId: null,  // 나중에 유저 아이디 추가
    comments: [],
    answers: [],
  };

  return await addDoc(collection(dbService, 'question'), questionObj);
};

const addPost = async () => {};

export default addPost;
export { addQuestion, addAnswer, addComment };
