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
        <div>
          🎮 Le jeu commence !
        </div>
      )}
    </main>
  );
}
