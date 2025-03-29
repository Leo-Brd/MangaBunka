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


    return (
        <>
            <header>
                <motion.div
                    className='Header__logo'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Link to="/">
                        <img src={Logo} alt="logo" />
                    </Link>
                </motion.div>

                <div className='Header__kanas'>
                    <p>マ</p>
                    <p>ン</p>
                    <p>ガ</p>
                    <p>ブ</p>
                    <p>ン</p>
                    <p>カ</p>
                </div>

                <div className='Header__links'>
                    {isLoggedIn ? (
                        <>
                            <button onClick={openModal}>
                                Mon Profil
                            </button>
                            {user && (
                                <div className='Header__user'>
                                    <img 
                                        src={getProfilePicUrl()}
                                        alt="Profile image" 
                                        className="Header__profilePic" 
                                    />
                                    <span className="Header__username">{user.username}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link to="/login">
                            Se connecter
                        </Link>
                    )}
                </div>
            </header>

            <ProfileModal isOpen={isModalOpen} onClose={closeModal} />
            
        </>
    );
}