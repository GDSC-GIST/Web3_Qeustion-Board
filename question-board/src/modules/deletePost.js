import { dbService } from '../firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

// 한 개의 댓글 삭제
const deleteComment = async (commentId) => {
  // 삭제할 댓글의 정보 가져오기
  const commentRef = doc(dbService, `comment/${commentId}`);
  const commentObj = (await getDoc(commentRef)).data();

  // 부모의 comments(list) 수정해야 하므로 부모 정보 가져오기
  const parentRef = doc(dbService, `${commentObj.parentType}/${commentObj.parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  // 부모의 comments(list)에서 해당하는 댓글 찾기
  const commentIndex = parentObj.comments.indexOf(commentId);
  parentObj.comments.splice(commentIndex, 1)

  // 부모 comments(list) 업데이트
  await updateDoc(parentRef, {
    comments: [...parentObj.comments],
  });

  // 댓글 삭제
  return await deleteDoc(commentRef);
};

// 한 개의 답변 삭제
const deleteAnswer = async (answerId) => {
  // 삭제할 answer의 정보 가져오기
  const answerRef = doc(dbService, `answer/${answerId}`);
  const answerObj = (await getDoc(answerRef)).data();

  // 부모의 answers(list)를 수정해야 하므로 부모 정보 가져오기
  const parentRef = doc(dbService, `question/${answerObj.parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  // 부모의 answers(list)에서 해당하는 댓글 찾기
  const answerIndex = parentObj.answers.indexOf(answerId);
  parentObj.answers.splice(answerIndex, 1);

  // 답변에 달린 댓글 삭제
  await deleteComments(answerObj);
  // 부모 answers(list) 수정
  await updateDoc(parentRef, {
    answers: [...parentObj.answers],
  });

  // 답변 삭제
  return await deleteDoc(answerRef);
};

// 댓글리스트 comments(list)에 있는 모든 댓글 삭제
const deleteComments = async (postObj) => {
  // 댓글 삭제 결과(Promise)를 저장한 배열
  const result = postObj.comments.map(async (commentId) => {
    return deleteComment(commentId);
  });
  
  // 배열의 Promise 객체가 settled 될때까지 기다림
  return Promise.allSettled(result);
};

// 답변리스트 answers(list)에 있는 모든 답변 삭제
const deleteAnswers = async (questionObj) => {
  // 답변 삭제 결과(Promise)를 저장한 배열
  const result = questionObj.answers.map(async (answerId) => {
    return deleteAnswer(answerId);
  });

  return Promise.allSettled(result);
};

// 모든 타입의 게시글 삭제
const deletePost = async (type, postId) => {
  switch (type) {
    case 'comment':
      await deleteComment(postId);
      break;
    
    case 'answer':
      await deleteAnswer(postId);
      break;
    
    case 'question':
      // 삭제할 질문 정보 가져오기
      const postRef = doc(dbService, `${type}/${postId}`);
      const postObj = (await getDoc(postRef)).data();

      // 댓글과 답변이 모두 삭제될 때까지 기다림
      await Promise.allSettled([deleteComments(postObj), deleteAnswers(postObj)]);
      // 질문 삭제
      await deleteDoc(postRef);
      break;

    default:
  }
};

export default deletePost;
