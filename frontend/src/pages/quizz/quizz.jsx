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

// Fonction améliorée avec retry et délai exponentiel
const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.response_code === 0 && data.results) {
        return data.results;
      }
      throw new Error('API returned invalid data');
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// Fonction pour récupérer et formater les questions
const fetchQuestions = async (difficulty) => {
  try {
    const results = await fetchWithRetry(
      `https://opentdb.com/api.php?amount=20&category=31&difficulty=${difficulty}&type=multiple`
    );
    return results.map(formatQuestion);
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
  const [loadProgress, setLoadProgress] = useState({
    easy: false,
    medium: false,
    hard: false
  });

  // Charger les questions selon le mode
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      setLoadProgress({ easy: false, medium: false, hard: false });

      try {
        let questions = [];

        if (mode === "all") {
          const fetchAndUpdateProgress = async (difficulty) => {
            const result = await fetchQuestions(difficulty);
            setLoadProgress(prev => ({ ...prev, [difficulty]: true }));
            return result;
          };

          // Lance toutes les requêtes en parallèle avec suivi de progression
          const [easy, medium, hard] = await Promise.all([
            fetchAndUpdateProgress('easy'),
            fetchAndUpdateProgress('medium'),
            fetchAndUpdateProgress('hard')
          ]);
          
          const allQuestions = [
            ...easy.map(q => ({ ...q, originalDifficulty: 'easy' })),
            ...medium.map(q => ({ ...q, originalDifficulty: 'medium' })),
            ...hard.map(q => ({ ...q, originalDifficulty: 'hard' }))
          ];
          
          questions = shuffleArray(allQuestions).slice(0, 20);
        } else {
          questions = await fetchQuestions(mode);
          setLoadProgress({ easy: true, medium: true, hard: true });
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
    
    const loadQuestions = async () => {
      try {
        let questions = [];
        
        if (mode === "all") {
          const fetchAndUpdateProgress = async (difficulty) => {
            const result = await fetchQuestions(difficulty);
            return result;
          };

          const [easy, medium, hard] = await Promise.all([
            fetchAndUpdateProgress('easy'),
            fetchAndUpdateProgress('medium'),
            fetchAndUpdateProgress('hard')
          ]);
          
          const allQuestions = [
            ...easy.map(q => ({ ...q, originalDifficulty: 'easy' })),
            ...medium.map(q => ({ ...q, originalDifficulty: 'medium' })),
            ...hard.map(q => ({ ...q, originalDifficulty: 'hard' }))
          ];
          
          questions = shuffleArray(allQuestions).slice(0, 20);
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

  const navigateToMenu = () => {
    window.location.href = "/";
  };

  return (
    <main id="quizz">
      {loading ? (
        mode === "all" ? (
          <div className="loading-container">
            <h3>Chargement des questions...</h3>
            <div className="progress-bars">
              <div className={`progress ${loadProgress.easy ? 'completed' : ''}`}>Facile</div>
              <div className={`progress ${loadProgress.medium ? 'completed' : ''}`}>Moyen</div>
              <div className={`progress ${loadProgress.hard ? 'completed' : ''}`}>Difficile</div>
            </div>
            <p>Veuillez patienter pendant le chargement...</p>
          </div>
        ) : (
          <CountdownLoader onComplete={() => setLoading(false)} />
        )
      ) : error ? (
        <div className="game-over">
          <h2>Erreur</h2>
          <p>{error}</p>
          <div className="gameover-buttons">
            <button onClick={restartQuiz}>Réessayer</button>
            <button onClick={navigateToMenu} className="menu-button">Retourner au menu</button>
          </div>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <h2>Quiz Terminé !</h2>
          <p>Votre score : {score} / {questions.length}</p>
          <div className="gameover-buttons">
            <button onClick={restartQuiz}>Rejouer</button>
            <button onClick={navigateToMenu} className="menu-button">Retourner au menu</button>
          </div>
          <div className="score-stars">
            {[...Array(Math.min(Math.floor(score/questions.length * 5), 5))].map((_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="quizz-container">
          <Leaderboard />

          <article className="question-container">
            <p className="question-difficulty">{questions[currentQuestionIndex].originalDifficulty}</p>
            <h2 className="question">{questions[currentQuestionIndex].question}</h2>

            <div className="answers">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`answer 
                    ${validated && option === questions[currentQuestionIndex].correctAnswer ? 'correct' : ''} 
                    ${validated && option === selectedAnswer && option !== questions[currentQuestionIndex].correctAnswer ? 'incorrect' : ''}
                    ${selectedAnswer === option ? 'selected' : ''}`}
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
                Valider
              </button>
            ) : (
              <button
                className="next-button"
                onClick={handleNextQuestion}
              >
                Suivant
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