const contentTest = (editorState) => {
  // check content is neither null nor whitespace
  const blockMap = editorState.getCurrentContent().getBlockMap();
  let contentFilled = false;

  for (const [key, content]  of blockMap) {
    const text = content.getText().trim();

    if (text) {
      contentFilled = true;
      return true;
    }
  }

  if (!contentFilled) {
    alert('내용을 입력하세요')
    return false;
  }
};

const questionTest = (editorState) => {
  // check grade is selected
  const gradeSelected = document.getElementById('grade').value;

  // check subject is selected
  const subjectSelected = document.getElementById('subject').value;

  // check title is neither null nor whitespace
  const titleFilled = document.getElementById('questionTitle').value.trim();

  if (!gradeSelected) {
    alert('학년을 선택하세요');
    return false;
  } else if (!subjectSelected) {
    alert('과목을 선택하세요');
    return false;
  } else if (!titleFilled) {
    alert('제목을 입력하세요');
    return false;
  } else if (!contentTest(editorState)) {
    return false;
  }

  return true;
};

export { contentTest, questionTest };
