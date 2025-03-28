import { motion, AnimatePresence } from 'framer-motion';
import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DefaultPP from '../../assets/defaultPP.png';
import './profileModal.scss';

export default function ProfileModal({ isOpen, onClose }) {
    const { logout, checkAuthError, user: authUser, isLoggedIn } = useContext(AuthContext);
    const [user, setUser] = useState(authUser || null);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const fileInputRef = useRef(null);
    const API_URI = import.meta.env.VITE_API_URI;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [isLoggedIn]);

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

                    const response = await fetch(`${API_URI}/user/updateProfilePic/${user._id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    });

                    if (checkAuthError(response)) {
                        return;
                    }

                    console.log(response);

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
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URI}/user/updateUsername/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (checkAuthError(response)) {
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la mise à jour du pseudo');
            }

            console.log('Pseudo mis à jour avec succès :', data);

            const updatedUser = { ...user, username: newUsername };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsEditingUsername(false);
            setNewUsername('');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pseudo :', error);
            alert(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="modal-content"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="modal-close" onClick={onClose}>✖️</button>

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
                                        <button onClick={handleSaveUsername} className='Save__button'>Sauvegarder</button>
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
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
