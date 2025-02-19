import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './quizz.scss'
import { questionLists, allQuestions } from "../../assets/questions";
import Leaderboard from '../../components/leaderboard/leaderboard';


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
  const shuffled = [...questions].sort(() => 0.5 - Math.random()); // Mélange les questions
  return shuffled.slice(0, count); // Prend les 20 premières
};


export default function Quizz() {
  const [loading, setLoading] = useState(true);
  const { mode } = useParams();

  useEffect(() => {
    let selectedQuestions = [];

    if (mode === "all") {
      selectedQuestions = getRandomQuestions(allQuestions);
    } else {
      const level = parseInt(mode, 10);
      selectedQuestions = getRandomQuestions(questionLists[level] || []);
    }
  }, [mode]);

  return (
    <main id="quizz">

      {loading ? (
        <CountdownLoader onComplete={() => setLoading(false)} />
      ) : (
        <div className="quizz-container">
          <Leaderboard />

          <article className="question-container">
            <h2 className="question">Quel est l'objectif de Luffy ?</h2>
            <div className="answers">
                <button className="answer">Devenir le roi des pirates</button>
                <button className="answer">Manger un fruit du démon</button>
                <button className="answer">Sauver le monde</button>
                <button className="answer">Devenir le Hokage</button>
            </div>
          </article>

          <Leaderboard />
        </div>
      )}
    </main>
  );
}
