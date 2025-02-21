import './gameModeSelection.scss';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Luffy from '../../assets/luffy.png';

export default function GameModeSelection() {

    return (
        <main id="game-mode-selection">
            <h1>Choisissez votre mode de jeu</h1>
            <div className="card-container">

                <div className="game-card">
                    <h2>Tous Niveaux</h2>
                    <p>Jouez sans restriction de niveau et affrontez des défis variés !</p>
                    <Link to="/quizz/all">
                        <button className='game-card__play-btn'>Jouer</button>
                    </Link>
                </div>

                <div className="game-card">
                    <h2>Choisir le Niveau</h2>
                    <p>Sélectionnez un niveau de difficulté entre 1 et 5.</p>
                    <div className="level-buttons">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <Link to={`/quizz/${level}`} key={level}>
                                <button key={level}>Niveau {level}</button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <motion.img
                src={Luffy}
                alt="Luffy"
                id="Luffy__img"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </main>
    );
}
