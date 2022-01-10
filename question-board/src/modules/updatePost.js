import { dbService, storageService } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { convertToRaw } from 'draft-js';
import { v4 } from 'uuid';

// 수정한 답변을 firestore에 업데이트하는 함수
const updateAnswer = async (answerId, editorState, attachment) => {
  // 수정할 답변 정보 가져오기
  const answerRef = doc(dbService, `answer/${answerId}`);

  let attachmentUrl='';
  if (attachment && !attachment.includes('https://firebasestorage')) {
    // 첨부파일이 변경된 경우 storage에 업로드 후 다운로드 url 가져오기
    const attachmentRef = ref(storageService, `${v4}`);
    await uploadString(attachmentRef, attachment, 'data_url');
    attachmentUrl = await getDownloadURL(attachmentRef);
  } else if (attachment) {
    // 첨부파일이 변경되지 않은 경우
    attachmentUrl = attachment;
  }

  // 변경 사항을 저장하는 객체
  const updated = {
    content: convertToRaw(editorState.getCurrentContent()),
    attachmentUrl: attachmentUrl,
    editedAt: Date.now(),
  };

  // 수정 사항 업데이트
  await updateDoc(answerRef, updated);
};

// 수정한 댓글을 firestore에 업데이트하는 함수
const updateComment = async (commentId, editorState) => {
  // 수정할 댓글 정보 가져오기
  const commentRef = doc(dbService, `comment/${commentId}`);

  // 변경 사항을 저장하는 객체
  const updated = {
    content: convertToRaw(editorState.getCurrentContent()),
    editedAt: Date.now(),
  };

  // 수정 사항 업데이트
  await updateDoc(commentRef, updated);
};

// 수정한 질문을 firestore에 업데이트하는 함수
const updateQuestion = async (questionId, editorState, attachment) => {
  // 수정할 질문 정보 가져오기
  const questionRef = doc(dbService, `question/${questionId}`);

  let attachmentUrl='';
  if (attachment && !attachment.includes('https://firebasestorage')) {
    // 첨부파일이 변경된 경우 storage에 업로드 후 다운로드 url 가져오기
    const attachmentRef = ref(storageService, `${v4()}`);
    await uploadString(attachmentRef, attachment, 'data_url');
    attachmentUrl = await getDownloadURL(attachmentRef);
  } else if (attachment) {
    // 첨부파일이 변경되지 않은 경우
    attachmentUrl = attachment;
  }

  // 변경 사항을 저장하는 객체
  const updated = {
    grade: document.getElementById('grade').value,
    subject: document.getElementById('subject').value,
    title: document.getElementById('questionTitle').value.trim(),
    content: convertToRaw(editorState.getCurrentContent()),
    attachmentUrl: attachmentUrl,
    editedAt: Date.now(),
  };

  // 수정 사항 업데이트
  await updateDoc(questionRef, updated);
};

export { updateQuestion, updateAnswer, updateComment };
