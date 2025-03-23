import { motion } from 'framer-motion';
import './leaderboard.scss';
import Logo from '../../assets/trophee-etoile.png'

const players = [
    { rank: 1, name: 'Zoro', xp: 15000 },
    { rank: 2, name: 'Luffy', xp: 14000 },
    { rank: 3, name: 'Sanji', xp: 13000 },
    { rank: 4, name: 'Nami', xp: 12500 },
    { rank: 5, name: 'Robin', xp: 12000 },
];

export default function Leaderboard({ largeVersion = false }) {
    return (
        <section id="leaderboard" className={largeVersion ? 'large' : ''}>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='Leaderboard__title'
            >
                <img src={Logo} alt="Logo trophée"/>
                <h2>Classement des Meilleurs Joueurs</h2>
            </motion.div>

            <table>
                <thead>
                    <tr>
                        <th>Rang</th>
                        <th>Joueur</th>
                        {largeVersion && <th>XP</th>}
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <motion.tr
                            key={player.rank}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: player.rank * 0.1 }}
                        >
                            <td>#{player.rank}</td>
                            <td>{player.name}</td>
                            {largeVersion && <td>{player.xp} XP</td>}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
