import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();

      if (!session?.session) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const userId = session.session.user.id;

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to fetch quizzes');
      } else {
        setQuizzes(data || []);
      }

      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  const handleShare = (id) => {
    const quizUrl = `${window.location.origin}/quiz/${id}`;
    navigator.clipboard.writeText(quizUrl);
    alert('Quiz link copied to clipboard!');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes found. Create one now!</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="p-4 bg-gray-100 rounded shadow">
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p>Created at: {new Date(quiz.created_at).toLocaleString()}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => (window.location.href = `/quiz/${quiz.id}`)}
                  className="bg-green-500 text-white p-2 rounded shadow hover:bg-green-600"
                >
                  Take Quiz
                </button>
                <button
                  onClick={() => (window.location.href = `/quiz/edit/${quiz.id}`)}
                  className="bg-yellow-500 text-white p-2 rounded shadow hover:bg-yellow-600"
                >
                  Edit Quiz
                </button>
                <button
                  onClick={() => handleShare(quiz.id)}
                  className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600"
                >
                  Share Quiz
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => (window.location.href = '/quiz/create')}
        className="mt-4 bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600"
      >
        Create New Quiz
      </button>
    </div>
  );
};

export default Dashboard;