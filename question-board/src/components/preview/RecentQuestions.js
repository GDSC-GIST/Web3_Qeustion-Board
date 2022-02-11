import { useEffect, useState } from 'react';
import { dbService } from '../../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import QuestionPreview from './QuestionPreview';
import '../../style.css';

const RecentQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const qCollection = collection(dbService, 'question');
    onSnapshot(query(qCollection, orderBy('createdAt', 'desc')), (snapshot) => {
      const recentFiveQuestions = [...snapshot.docs.splice(0, 5)].map((docRef) => docRef.id);
      setQuestions([...recentFiveQuestions]);
    });
  }, []);

  return (
    <div className="container">
      <section id="section">
        <article id="question" style={{padding: '20px'}}>
          <span id="question" style={{marginBottom: '10px'}}>방금 올라온 질문</span>
          {questions.map((questionId) => 
            <QuestionPreview questionId={questionId} key={questionId} />
          )}
        </article>
      </section>
    </div>
  );
};

export default RecentQuestions;
