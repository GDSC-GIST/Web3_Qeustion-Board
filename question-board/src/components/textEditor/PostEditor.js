import StyleEditor from './StyleEditor';

const PostEditor = () => {
  return (
    <>
      <div>
        <select id='postSubject'>
          <option value='subject' defaultValue>---</option>
          <option value='korean'>국어</option>
          <option value='english'>영어</option>
          <option value='mathematics'>수학</option>
          <option value='science'>과학</option>
        </select>
        <input id='postTitle' type={'text'} placeholder='제목을 입력하세요' />
      </div>

      <StyleEditor type={'post'} />
    </>
  );
}

export default PostEditor;
