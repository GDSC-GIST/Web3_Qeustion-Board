// 내용이 비어있는지 확인
const contentTest = (editorState) => {
  // check content is neither null nor whitespace
  const blockMap = editorState.getCurrentContent().getBlockMap();

  for (const [key, content]  of blockMap) {
    const text = content.getText().trim();

    // 텍스트가 있는 블럭이 있으면 true 반환
    if (text) {
      return true;
    }
  }

  alert('내용을 입력하세요');
  return false;
};

// 질문 폼의 모든 칸이 채워졌는지 확인
const questionTest = (editorState) => {
  // 과정, 과목, 제목 정보 가져옴
  const gradeSelected = document.getElementById('grade').value;
  const subjectSelected = document.getElementById('subject').value;
  const titleFilled = document.getElementById('questionTitle').value.trim();

  if (!gradeSelected) {
    // 과정을 선택하지 않은 경우
    alert('과정을 선택하세요');

    return false;
  } else if (!subjectSelected) {
    // 과목을 선택하지 않은 경우
    alert('과목을 선택하세요');

    return false;
  } else if (!titleFilled) {
    // 제목을 선택하지 않은 경우
    alert('제목을 입력하세요')

    return false;
  } else if (!contentTest(editorState)) {
    // 내용이 비어있는 경우
    return false;
  }

  return true;
};

export { contentTest, questionTest };
