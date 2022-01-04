import { dbService, storageService } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { convertToRaw } from 'draft-js';
import { v4 } from 'uuid';

const updateAnswer = async (answerId, editorState, attachment) => {
  const answerRef = doc(dbService, `answer/${answerId}`);

  let attachmentUrl='';
  if (attachment && !attachment.includes('https://firebasestorage')) {
    // 첨부파일이 있는 경우 Storage에 업로드
    const attachmentRef = ref(storageService, `${v4}`);
    await uploadString(attachmentRef, attachment, 'data_url');
    attachmentUrl = await getDownloadURL(attachmentRef);
  } else if (attachment) {
    attachmentUrl = attachment;
  }

  const updated = {
    content: convertToRaw(editorState.getCurrentContent()),
    attachmentUrl: attachmentUrl,
    editedAt: Date.now(),
  };

  await updateDoc(answerRef, updated);

  return answerRef;
};

const updateComment = async (commentId, editorState) => {
  const commentRef = doc(dbService, `comment/${commentId}`);

  const updated = {
    content: convertToRaw(editorState.getCurrentContent()),
    editedAt: Date.now(),
  };

  await updateDoc(commentRef, updated);

  return commentRef;
};

const updateQuestion = async (questionId, editorState, attachment) => {
  const questionRef = doc(dbService, `question/${questionId}`);

  let attachmentUrl='';
  if (attachment && !attachment.includes('https://firebasestorage')) {
    // 첨부파일이 있는 경우 Storage에 업로드
    const attachmentRef = ref(storageService, `${v4()}`);
    await uploadString(attachmentRef, attachment, 'data_url');
    attachmentUrl = await getDownloadURL(attachmentRef);
  } else if (attachment) {
    attachmentUrl = attachment;
  }

  const updated = {
    grade: document.getElementById('grade').value,
    subject: document.getElementById('subject').value,
    title: document.getElementById('questionTitle').value.trim(),
    content: convertToRaw(editorState.getCurrentContent()),
    attachmentUrl: attachmentUrl,
    editedAt: Date.now(),
  };

  await updateDoc(questionRef, updated);

  return questionRef;
};

const updatePost = () => {};

export default updatePost;
export { updateQuestion, updateAnswer, updateComment };
