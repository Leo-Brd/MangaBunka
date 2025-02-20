import { motion } from 'framer-motion';
import './gameInfo.scss';

const GameInfo = ({ remainingQuestions, mode, scoreHistory }) => {
    return (
        <section className="game-info">
            <div className="info-section">
                <h3>Mode de jeu : <span>{mode}</span></h3>
                <h3>Questions restantes : <span>{remainingQuestions}</span></h3>
            </div>

            <div className="score-tracker">
                {scoreHistory.map((isCorrect, index) => (
                    <motion.div
                        key={index}
                        className={`score-dot ${isCorrect === null ? '' : isCorrect ? 'correct' : 'wrong'}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    />
                ))}
            </div>
        </section>
    );
};

export default GameInfo;