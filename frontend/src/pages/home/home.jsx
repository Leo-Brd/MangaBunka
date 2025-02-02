import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './home.scss';
import Leaderboard from '../../components/leaderboard/leaderboard';

export default function Home() {
  return (
    <main id="home">
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Teste tes connaissances sur l'univers des mangas avec des quiz variés et fun !
      </motion.p>
      
      <motion.div
        className='Home__button'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link to="/quizz/gamemode">
          <button>
            Commencer à jouer !
          </button>
        </Link>
      </motion.div>

      <Leaderboard />

    </main>
  );
}