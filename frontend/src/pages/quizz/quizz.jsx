import { useState, useEffect } from "react";
import './quizz.scss'

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

export default function Quizz() {
  const [loading, setLoading] = useState(true);

  return (
    <main id="quizz">
      {loading ? (
        <CountdownLoader onComplete={() => setLoading(false)} />
      ) : (
        <div className="question-container">
          <h2 className="question">Quel est l'objectif de Luffy ?</h2>
          <div className="answers">
              <button className="answer">Devenir le roi des pirates</button>
              <button className="answer">Manger un fruit du démon</button>
              <button className="answer">Sauver le monde</button>
              <button className="answer">Devenir le Hokage</button>
          </div>
        </div>
      )}
    </main>
  );
}
