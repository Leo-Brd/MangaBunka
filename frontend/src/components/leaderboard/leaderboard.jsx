import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './leaderboard.scss';
import Logo from '../../assets/trophee-etoile.png';
import DefaultPP from '../../assets/defaultPP.png';

export default function Leaderboard({ largeVersion = false }) {
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URI = import.meta.env.VITE_API_URI;

    useEffect(() => {
        const fetchTopPlayers = async () => {
            try {
                const response = await fetch(`${API_URI}/user/getTopUsersByXP`);
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des joueurs');
                }

                const data = await response.json();
                
                // Transformez les données pour correspondre à votre structure
                const formattedPlayers = data.data.map((user, index) => ({
                    rank: index + 1,
                    name: user.username,
                    xp: user.stats.xp,
                    profilePic: user.profilePic
                }));

                setTopPlayers(formattedPlayers);
            } catch (err) {
                console.error("Erreur:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopPlayers();
    }, [API_URI]);

    const getProfilePicUrl = (profilePic) => {
            if (!profilePic) return DefaultPP;
          
            if (profilePic.startsWith('data:')) {
              return user.profilePic;
            }
          
            const baseUrl = profilePic.startsWith('http') 
              ? '' 
              : API_URI;
          
            return `${baseUrl}${profilePic}?force=${Date.now()}`;
    };

    if (loading) {
        return (
            <section id="leaderboard" className={largeVersion ? 'large' : ''}>
                <div className="loading-message">Chargement du classement...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="leaderboard" className={largeVersion ? 'large' : ''}>
                <div className="error-message">Erreur: {error}</div>
            </section>
        );
    }

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
                    {topPlayers.map((player) => (
                        <motion.tr
                            key={player.rank}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: player.rank * 0.1 }}
                        >
                            <td>#{player.rank}</td>
                            <td className="player-cell">
                                <img 
                                    src={getProfilePicUrl(player.profilePic)} 
                                    alt={player.name}
                                    className="player-avatar"
                                />
                                {player.name}
                            </td>
                            {largeVersion && <td>{player.xp.toLocaleString()} XP</td>}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}