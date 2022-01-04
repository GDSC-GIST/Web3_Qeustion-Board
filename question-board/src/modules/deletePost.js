import { dbService } from '../firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

// 한 개의 comment 삭제
const deleteComment = async (commentId) => {
  const commentRef = doc(dbService, `comment/${commentId}`);
  const commentObj = (await getDoc(commentRef)).data();

  const parentRef = doc(dbService, `${commentObj.parentType}/${commentObj.parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  const commentIndex = parentObj.comments.indexOf(commentId);
  parentObj.comments.splice(commentIndex, 1)

  await updateDoc(parentRef, {
    comments: [...parentObj.comments],
  });
  await deleteDoc(commentRef);
};

// 한 개의 answer 삭제
const deleteAnswer = async (answerId) => {
  const answerRef = doc(dbService, `answer/${answerId}`);
  const answerObj = (await getDoc(answerRef)).data();

  const parentRef = doc(dbService, `question/${answerObj.parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  const answerIndex = parentObj.answers.indexOf(answerId);
  parentObj.answers.splice(answerIndex, 1);

  await deleteComments(answerObj);
  await updateDoc(parentRef, {
    answers: [...parentObj.answers],
  });
  await deleteDoc(answerRef);
};

// comments(list) 삭제
const deleteComments = async (postObj) => {
  // 댓글 삭제 결과(Promise)를 저장한 배열
  const result = postObj.comments.map(async (commentId) => {
    const commentRef = doc(dbService, `comment/${commentId}`);
    return deleteDoc(commentRef);
  });
  
  // 배열의 Promise 객체가 settled 될때까지 기다림
  return Promise.allSettled(result);
};

// answers(list) 삭제
const deleteAnswers = async (questionObj) => {
  const result = questionObj.answers.map(async (answerId) => {
    const answerRef = doc(dbService, `answer/${answerId}`);
    const answerObj = (await getDoc(answerRef)).data();

    await deleteComments(answerObj);

    return deleteDoc(answerRef);
  });

  return Promise.allSettled(result);
};

// 모든 타입의 게시물 삭제
const deletePost = async (type, postId) => {
  const postRef = doc(dbService, `${type}/${postId}`);
  const postObj = (await getDoc(postRef)).data();

  switch (type) {
    case 'comment':
      await deleteComment(postId);
      break;
    
    case 'answer':
      await deleteAnswer(postId);
      break;
    
    case 'question':
      await Promise.allSettled([deleteComments(postObj), deleteAnswers(postObj)]);
      await deleteDoc(postRef);
      break;

    default:
  }
};

export default deletePost;
