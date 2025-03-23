import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../modal/modal';
import Logo from '../../assets/logo.png';
import DefaultPP from '../../assets/defaultPP.png';
import './header.scss';

export default function Header() {
    const { isLoggedIn, logout, user: authUser } = useContext(AuthContext);
    const [user, setUser] = useState(authUser || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
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
    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newProfilePic = reader.result;

                // Mettre à jour l'image dans l'état local
                const updatedUser = { ...user, profilePic: newProfilePic };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

                const token = localStorage.getItem('token');

                // Envoyer la nouvelle image à l'API
                try {
                    const formData = new FormData();
                    formData.append('profilePic', file);

                    const response = await fetch(`http://localhost:4000/api/auth/updateProfilePic/${user._id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Erreur lors de la mise à jour du profil');
                    }

                    const data = await response.json();
                    console.log('Profil mis à jour avec succès :', data);
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du profil :', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Fonction pour déclencher le champ de fichier
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Fonction pour éditer le pseudo
    const handleEditUsername = () => {
        setIsEditingUsername(true);
        setNewUsername(user.username);
    };

    // Fonction pour sauvegarder le nouveau pseudo
    const handleSaveUsername = async () => {
        if (newUsername.trim() === '') return;

        try {
            const updatedUser = { ...user, username: newUsername };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:4000/api/auth/updateUsername/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du pseudo');
            }

            const data = await response.json();
            console.log('Pseudo mis à jour avec succès :', data);

            setIsEditingUsername(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pseudo :', error);
        }
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
                        <p>
                            <span>Pseudo :</span>
                            {isEditingUsername ? (
                                <>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                    />
                                    <button onClick={handleSaveUsername}>Sauvegarder</button>
                                </>
                            ) : (
                                <>
                                    {user.username}
                                    <button onClick={handleEditUsername}>✎</button>
                                </>
                            )}
                        </p>
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