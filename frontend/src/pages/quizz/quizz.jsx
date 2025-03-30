import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import './quizz.scss';
import Leaderboard from '../../components/leaderboard/leaderboard';
import GameInfo from '../../components/gameInfo/gameInfo';
import { AuthContext } from '../../context/AuthContext';

const CountdownLoader = ({ onComplete }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [countdown, onComplete]);

  return (
    <div className="loader">
      <div className="count">{countdown}</div>
    </div>
  );
};

// Fonction pour récupérer et formater les questions
const fetchQuestions = async (difficulty) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=20&category=31&difficulty=${difficulty}&type=multiple`
    );
    const data = await response.json();
    
    if (data.response_code !== 0 || !data.results) {
      throw new Error('API returned invalid data');
    }

    return data.results.map(formatQuestion);
  } catch (error) {
    console.error(`Error fetching ${difficulty} questions:`, error);
    return [];
  }
};

// Formater une question de l'API
const formatQuestion = (apiQuestion) => {
  return {
    question: decodeHtmlEntities(apiQuestion.question),
    options: shuffleArray([
      ...apiQuestion.incorrect_answers.map(decodeHtmlEntities),
      decodeHtmlEntities(apiQuestion.correct_answer)
    ]),
    correctAnswer: decodeHtmlEntities(apiQuestion.correct_answer),
    category: decodeHtmlEntities(apiQuestion.category),
    difficulty: apiQuestion.difficulty,
    type: apiQuestion.type
  };
};

// Décoder les entités HTML
const decodeHtmlEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

// Mélanger un tableau
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Quizz() {
  const { checkAuthError } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const { mode } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  // Charger les questions selon le mode
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        let questions = [];

        if (mode === "all") {
          const [easy, medium, hard] = await Promise.all([
            fetchQuestions('easy'),
            fetchQuestions('medium'),
            fetchQuestions('hard')
          ]);
          questions = shuffleArray([...easy, ...medium, ...hard]).slice(0, 20);
        } else {
          questions = await fetchQuestions(mode);
        }

        if (questions.length === 0) {
          throw new Error('No questions loaded');
        }

        setQuestions(questions);
      } catch (error) {
        console.error("Failed to load questions:", error);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [mode]);

  const handleAnswerSelect = (answer) => {
    if (!validated) {
      setSelectedAnswer(answer);
    }
  };

  const handleValidation = () => {
    if (selectedAnswer) {
      setValidated(true);
      const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
      if (isCorrect) setScore(score + 1);
      setScoreHistory([...scoreHistory, isCorrect]);
    }
  };

  const handleGameOver = async () => {
    const API_URI = import.meta.env.VITE_API_URI;
    const token = localStorage.getItem('token');

    if (user && token) {
      try {
        const response = await fetch(`${API_URI}/user/updateStats/${user._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ score }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify({
            ...user,
            stats: data.stats
          }));
        }
      } catch (error) {
        console.error('Failed to update stats:', error);
      }
    }
  };

  const handleNextQuestion = () => {
    setValidated(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleGameOver();
      setGameOver(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setScoreHistory([]);
    setGameOver(false);
    setSelectedAnswer(null);
    setValidated(false);
    setLoading(true);
    setError(null);
    
    // Recharger les questions
    const loadQuestions = async () => {
      try {
        let questions = [];
        
        if (mode === "all") {
          const [easy, medium, hard] = await Promise.all([
            fetchQuestions('easy'),
            fetchQuestions('medium'),
            fetchQuestions('hard')
          ]);
          questions = shuffleArray([...easy, ...medium, ...hard]).slice(0, 20);
        } else {
          questions = await fetchQuestions(mode);
        }
        
        setQuestions(questions);
      } catch (error) {
        setError("Failed to reload questions");
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  };

  return (
    <main id="quizz">
      {loading ? (
        <CountdownLoader onComplete={() => setLoading(false)} />
      ) : error ? (
        <div className="game-over">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={restartQuiz}>Try Again</button>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} / {questions.length}</p>
          <button onClick={restartQuiz}>Play Again</button>
        </div>
      ) : (
        <div className="quizz-container">
          <Leaderboard />

          <article className="question-container">
            <h2 className="question">{questions[currentQuestionIndex].question}</h2>

            <div className="answers">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`answer 
                    ${validated && option === questions[currentQuestionIndex].correctAnswer ? 'correct' : ''} 
                    ${validated && option === selectedAnswer && option !== questions[currentQuestionIndex].correctAnswer ? 'incorrect' : ''}
                    ${selectedAnswer === option ? 'selected' : ''}`
                  }
                  onClick={() => handleAnswerSelect(option)}
                  disabled={validated}
                >
                  {option}
                </button>
              ))}
            </div>

            {!validated ? (
              <button
                className="validate-button"
                onClick={handleValidation}
                disabled={!selectedAnswer}
              >
                Validate
              </button>
            ) : (
              <button
                className="next-button"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            )}
          </article>

          <GameInfo
            remainingQuestions={questions.length - currentQuestionIndex}
            mode={mode}
            scoreHistory={scoreHistory}
          />
        </div>
      )}
    </main>
  );
}