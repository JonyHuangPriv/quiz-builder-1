import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient';

const EditQuiz = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchQuiz = async () => {
        const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
        if (!error) {
          setTitle(data.title);
          setQuestions(data.questions);
        }
      };
      fetchQuiz();
    }
  }, [id]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: ['', '', '', ''], correct: 0 }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'answers') {
      updatedQuestions[index].answers = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const userId = session.session.user.id;

    // Update the quiz in the database
    const { data, error } = await supabase.from('quizzes').update({
      title,
      questions,
      user_id: userId,
    }).eq('id', id);

    setLoading(false);

    if (error) {
      setError('Failed to update quiz');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4">Edit Quiz</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-4 p-2 border"
        />
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              className="block w-full mb-2 p-2 border"
            />
            {q.answers.map((answer, ai) => (
              <input
                key={ai}
                type="text"
                placeholder={`Answer ${ai + 1}`}
                value={answer}
                onChange={(e) => {
                  const updatedAnswers = [...q.answers];
                  updatedAnswers[ai] = e.target.value;
                  updateQuestion(index, 'answers', updatedAnswers);
                }}
                className="block w-full mb-2 p-2 border"
              />
            ))}
            <select
              value={q.correct}
              onChange={(e) => updateQuestion(index, 'correct', parseInt(e.target.value))}
              className="block w-full mb-2 p-2 border"
            >
              {q.answers.map((_, ai) => (
                <option key={ai} value={ai}>
                  Correct Answer {ai + 1}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="bg-gray-500 text-white p-2 rounded w-full mb-4">
          Add Question
        </button>
        <button type="submit" className={`bg-blue-500 text-white p-2 rounded w-full ${loading ? 'opacity-50' : ''}`} disabled={loading}>
          {loading ? 'Saving...' : 'Save Quiz'}
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;