import { dbService } from '../firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

// 한 개의 댓글 삭제
const deleteComment = async (userId, commentId) => {
  // 삭제할 댓글의 정보 가져오기
  const commentRef = doc(dbService, `comment/${commentId}`);
  const commentObj = (await getDoc(commentRef)).data();

  // 유저 정보 가져오기: 유저의 comments(list) 수정해야 함
  const userRef = doc(dbService, `user/${userId}`);
  const userObj = (await getDoc(userRef)).data();

  // 부모 정보 가져오기: 부모의 comments(list) 수정해야 함
  const parentRef = doc(dbService, `${commentObj.parentType}/${commentObj.parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  // 유저 comments(list) 업데이트
  const updateUser = updateDoc(userRef, {
    comments: userObj.comments.filter((comment) => comment !== commentId),
  });

  // 부모 comments(list) 업데이트
  const updateParent = updateDoc(parentRef, {
    comments: parentObj.comments.filter((comment) => comment !== commentId),
  });

  // 댓글 삭제
  const deleteComment = deleteDoc(commentRef);

  // 삭제가 완료될 때까지 기다림
  await Promise.allSettled([updateUser, updateParent, deleteComment]);
};

// 한 개의 답변 삭제
const deleteAnswer = async (userId, answerId) => {
  // 삭제할 answer의 정보 가져오기
  const answerRef = doc(dbService, `answer/${answerId}`);
  const answerObj = (await getDoc(answerRef)).data();

  // 유저 정보 가져오기: 유저의 answers(list) 수정해야 함
  const userRef = doc(dbService, `user/${userId}`);
  const userObj = (await getDoc(userRef)).data();

  // 부모 정보 가져오기: 부모의 answers(list) 수정해야 함 
  const parentRef = doc(dbService, `question/${answerObj.parentId}`);
  const parentObj = (await getDoc(parentRef)).data();

  // 답변에 달린 댓글 삭제
  await deleteComments(answerObj);

  // 유저의 answers(list) 수정
  const updateUser = updateDoc(userRef, {
    answers: userObj.answers.filter((answer) => answer !== answerId),
  })

  // 부모 answers(list) 수정
  const updateParent = updateDoc(parentRef, {
    answers: parentObj.answers.filter((answer) => answer !== answerId),
  });

  // 답변 삭제
  const deleteAnswer = deleteDoc(answerRef);

  // 삭제가 완료될 때까지 기다림
  await Promise.allSettled([updateUser, updateParent, deleteAnswer]);
};

// 댓글리스트 comments(list)에 있는 모든 댓글 삭제
const deleteComments = async (postObj) => {
  // 댓글 삭제 결과(Promise)를 저장한 배열
  const result = postObj.comments.map(async (commentId) => {
    return deleteComment(commentId);
  });
  
  // 삭제가 완료될 때까지 기다림
  await Promise.allSettled(result);
};

// 답변리스트 answers(list)에 있는 모든 답변 삭제
const deleteAnswers = async (questionObj) => {
  // 답변 삭제 결과(Promise)를 저장한 배열
  const result = questionObj.answers.map(async (answerId) => {
    return deleteAnswer(answerId);
  });

  // 삭제가 완료될 때까지 기다림
  await Promise.allSettled(result);
};

// 질문 삭제
const deleteQuestion = async (userId, questionId) => {
  // 유저 정보 가져오기
  const userRef = doc(dbService, `user/${userId}`);
  const userObj = (await getDoc(userRef)).data();

  // 삭제할 질문 정보 가져오기
  const postRef = doc(dbService, `question/${questionId}`);
  const postObj = (await getDoc(postRef)).data();

  // 댓글과 답변이 모두 삭제될 때까지 기다림
  await Promise.allSettled([deleteComments(postObj), deleteAnswers(postObj)]);
  // 질문 삭제
  const deleteQuestion = deleteDoc(postRef);

  // 유저 questions(list) 업데이트
  const updateUser = updateDoc(userRef, {
    questions: userObj.questions.filter((question) => question !== questionId),
  });

  // 삭제가 완료될 때까지 기다림
  await Promise.allSettled([deleteQuestion, updateUser]);
}

// 모든 타입의 게시글 삭제
const deletePost = async (type, userId, postId) => {
  switch (type) {
    case 'comment':
      await deleteComment(userId, postId);
      break;
    
    case 'answer':
      await deleteAnswer(userId, postId);
      break;
    
    case 'question':
      await deleteQuestion(userId, postId);
      break;

    default:
  }
};

export { deletePost };
