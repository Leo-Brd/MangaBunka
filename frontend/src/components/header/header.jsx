import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProfileModal from '../profileModal/profileModal';
import Logo from '../../assets/logo.png';
import DefaultPP from '../../assets/defaultPP.png';
import './header.scss';

export default function Header() {
    const { isLoggedIn, user: authUser, refreshKey } = useContext(AuthContext);
    const [user, setUser] = useState(authUser || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHoveringKanas, setIsHoveringKanas] = useState(false);
    const API_URI = import.meta.env.VITE_API_URI;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [refreshKey, isLoggedIn]);

    const getProfilePicUrl = () => {
        if (!user?.profilePic) return DefaultPP;
        
        if (user.profilePic.startsWith('data:')) {
            return user.profilePic;
        }
        
        const baseUrl = user.profilePic.startsWith('http') 
            ? '' 
            : API_URI;
        
        return `${baseUrl}${user.profilePic}?force=${Date.now()}`;
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const kanas = ['マ', 'ン', 'ガ', 'ブ', 'ン', 'カ'];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                <div className='Header__logo'>
                    <Link to="/">
                        <motion.img 
                            src={Logo} 
                            alt="logo" 
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        />
                    </Link>
                </div>

                <div 
                    className='Header__kanas'
                    onMouseEnter={() => setIsHoveringKanas(true)}
                    onMouseLeave={() => setIsHoveringKanas(false)}
                >
                    {kanas.map((kana, index) => (
                        <motion.p
                            key={index}
                            initial={{ y: 0 }}
                            animate={{ 
                                y: isHoveringKanas ? [0, -10, 0] : 0,
                                rotate: isHoveringKanas ? [0, 5, -5, 0] : 0
                            }}
                            transition={{ 
                                delay: index * 0.1,
                                duration: 0.6,
                                repeat: isHoveringKanas ? Infinity : 0,
                                repeatType: 'reverse'
                            }}
                        >
                            {kana}
                        </motion.p>
                    ))}
                </div>

                <div className='Header__links'>
                    {isLoggedIn ? (
                        <>
                            <motion.button 
                                onClick={openModal}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Mon Profil
                            </motion.button>
                            {user && (
                                <motion.div 
                                    className='Header__user'
                                    whileHover={{ scale: 1.02 }}
                                    title={user.username}
                                >
                                    <motion.img 
                                        src={getProfilePicUrl()}
                                        alt="Profile" 
                                        className="Header__profilePic"
                                        whileHover={{ rotate: 10 }}
                                        transition={{ type: 'spring' }}
                                    />
                                    <span className="Header__username">
                                        {user.username}
                                    </span>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <Link to="/login" className="Header__login-btn">
                            Se connecter
                        </Link>
                    )}
                </div>
            </motion.header>

            <ProfileModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
}