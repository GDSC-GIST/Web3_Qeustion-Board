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

const questionTest = (editorState) => {
  const gradeSelected = document.getElementById('grade').value;
  const subjectSelected = document.getElementById('subject').value;
  const titleFilled = document.getElementById('questionTitle').value.trim();

  if (!gradeSelected) {
    alert('과정을 선택하세요');

    return false;
  } else if (!subjectSelected) {
    alert('과목을 선택하세요');

    return false;
  } else if (!titleFilled) {
    alert('제목을 입력하세요')

    return false;
  } else if (!contentTest(editorState)) {
    return false;
  }

  return true;
};

export { contentTest, questionTest };
