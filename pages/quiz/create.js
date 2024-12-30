import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const CreateQuiz = () => {
  const { t, i18n } = useTranslation();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answers: ['', '', '', ''], correct: 0 }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
  
    // Insert the quiz into the database
    const { data, error } = await supabase.from('quizzes').insert([
      {
        title,
        questions,
        user_id: userId,
      },
    ]);
  
    setLoading(false);
  
    if (error) {
      setError('Failed to save quiz');
    } else {
      window.location.href = '/dashboard'; // Redirect to dashboard on success
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4">{t('createQuiz')}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder={t('quizTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-4 p-2 border"
        />
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder={t('question')}
              value={q.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              className="block w-full mb-2 p-2 border"
            />
            {q.answers.map((answer, ai) => (
              <input
                key={ai}
                type="text"
                placeholder={`${t('answer')} ${ai + 1}`}
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
                  {t('correctAnswer')} {ai + 1}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="bg-gray-500 text-white p-2 rounded w-full mb-4">
          {t('addQuestion')}
        </button>
        <button type="submit" className={`bg-blue-500 text-white p-2 rounded w-full ${loading ? 'opacity-50' : ''}`} disabled={loading}>
          {loading ? t('saving') : t('saveQuiz')}
        </button>
        <button type="button" onClick={toggleLanguage} className="mt-4 bg-green-500 text-white p-2 rounded w-full">
          {i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;