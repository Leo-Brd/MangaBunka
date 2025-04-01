import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './home.scss';
import Leaderboard from '../../components/leaderboard/leaderboard';

export default function Home() {
  return (
    <main id="home">
      <motion.div
        className="home-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="home-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Bienvenue sur MangaBunka
        </motion.h1>
        
        <motion.p
          className="home-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Teste tes connaissances sur l'univers des mangas avec des quiz variés et fun !
        </motion.p>
        
        <motion.div
          className='home-button-container'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/quizz/gamemode">
            <motion.button
              className="home-button"
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 8px 20px rgba(255, 107, 0, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer à jouer !
              <motion.span
                className="button-arrow"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      <Leaderboard largeVersion={true}/>
    </main>
  );
}