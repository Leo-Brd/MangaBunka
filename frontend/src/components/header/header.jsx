import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../modal/modal';
import Logo from '../../assets/logo.png';
import DefaultPP from '../../assets/defaultPP.png';
import './header.scss';

export default function Header() {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [isLoggedIn]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fonction pour gérer le changement de photo de profil
    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newProfilePic = reader.result;
                const updatedUser = { ...user, profilePic: newProfilePic };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    };

    // Fonction pour déclencher le champ de fichier
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

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
                                        src={user.profilePic || DefaultPP} 
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

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Mon Profil</h2>
                {user && (
                    <div className="modal-profile">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleProfilePicChange}
                        />
                        <div 
                            className="modal-profilePic"
                            onClick={triggerFileInput}
                            style={{ 
                                backgroundImage: `url(${user.profilePic || DefaultPP})`,
                                cursor: 'pointer',
                            }}
                        ></div>
                        <p><span>Pseudo :</span> {user.username}</p>
                        <p><span>Email :</span> {user.email}</p>
                        <p><span>Parties jouées :</span> {user.stats.gamesPlayed} </p>
                        <p><span>Score moyen :</span> {user.stats.averageScore}/20 </p>
                        <p><span>Niveau :</span> {user.stats.level} </p>
                        <p><span>XP :</span> {user.stats.xp} </p>

                        <button onClick={logout} className="logout-button">
                            Se déconnecter
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
}