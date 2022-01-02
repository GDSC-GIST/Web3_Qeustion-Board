const contentTest = (editorState) => {
  // check content is neither null nor whitespace
  const blockMap = editorState.getCurrentContent().getBlockMap();
  let isContentFilled = false;

  for (const [key, content]  of blockMap) {
    const text = content.getText().trim();

    if (text) {
      isContentFilled = true;
      return true;
    }
  }

  if (!isContentFilled) {
    alert('내용을 입력하세요')
    return false;
  }
};

const questionTest = (editorState) => {
  // check grade is selected
  const isGradeSelected = document.getElementById('grade').valeu;

  // check subject is selected
  const isSubjectSelected = document.getElementById('subject').value;

  // check title is neither null nor whitespace
  const isTitleFilled = document.getElementById('questionTitle').value.trim();

  if (!isGradeSelected) {
    alert('학년을 선택하세요');
    return false;
  } else if (!isSubjectSelected) {
    alert('과목을 선택하세요');
    return false;
  } else if (!isTitleFilled) {
    alert('제목을 입력하세요');
    return false;
  } else if (!contentTest(editorState)) {
    return false;
  }

  return true;
};

export { contentTest, questionTest };
