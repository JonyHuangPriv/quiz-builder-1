import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

const TakeQuiz = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchQuiz = async () => {
        const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
        if (!error) {
          setQuiz(data);
          setAnswers(Array(data.questions.length).fill(null));
        }
      };
      fetchQuiz();
    }
  }, [id]);

  const handleAnswerChange = (index, answerIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = answerIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz) return;

    let calculatedScore = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);

    // Save results (optional, for quiz owner)
    const { error } = await supabase.from('quiz_results').insert({
      quiz_id: id,
      answers,
      score: calculatedScore,
    });
    if (error) console.error('Error saving results:', error);
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
      {submitted ? (
        <div>
          <h2 className="text-xl">Your Score: {score}/{quiz.questions.length}</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
          {quiz.questions.map((q, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium mb-2">{q.question}</h3>
              {q.answers.map((a, ai) => (
                <label key={ai} className="block mt-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={ai}
                    checked={answers[index] === ai}
                    onChange={() => handleAnswerChange(index, ai)}
                    className="mr-2"
                  />
                  {a}
                </label>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full mt-4"
          >
            Submit Quiz
          </button>
        </form>
      )}
    </div>
  );
};

export default TakeQuiz;