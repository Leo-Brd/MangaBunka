import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './quizz.scss'
import { questionLists, allQuestions } from "../../assets/questions";
import Leaderboard from '../../components/leaderboard/leaderboard';
import GameInfo from '../../components/gameInfo/gameInfo';


// The loader component
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

// To select 20 random questions
const getRandomQuestions = (questions, count = 20) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};


export default function Quizz() {
  const [loading, setLoading] = useState(true);
  const { mode } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    let selectedQuestions = [];

    if (mode === "all") {
      selectedQuestions = getRandomQuestions(allQuestions);
    } else {
      const level = parseInt(mode, 10);
      selectedQuestions = getRandomQuestions(questionLists[level] || []);
    }
    
    setQuestions(selectedQuestions);
  }, [mode]);

  // Function to handle answer selection
  const handleAnswerSelect = (answer) => {
    if (!validated) {
      setSelectedAnswer(answer);
    }
  };

  // Function to validate the selected answer
  const handleValidation = () => {
    if (selectedAnswer) {
      setValidated(true);
      const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
        
        if (isCorrect) {
            setScore(score + 1);
        }

        setScoreHistory([...scoreHistory, isCorrect]);
    }
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    setValidated(false);
    setSelectedAnswer(null);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setGameOver(true);
    }
  };

  return (
    <main id="quizz">

      {loading ? (
        <CountdownLoader onComplete={() => setLoading(false)} />
      ) : gameOver ? (
        <div className="game-over">
          <h2>Quiz Terminé !</h2>
          <p>Ton score : {score} / {questions.length}</p>
          <button onClick={() => window.location.reload()}>Rejouer</button>
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
          remainingQuestions = {(20 - currentQuestionIndex)}
          mode = { mode }
          scoreHistory = { scoreHistory }
          />
        </div>
      )}
    </main>
  );
}
