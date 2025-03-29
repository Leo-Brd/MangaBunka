import { motion, AnimatePresence } from 'framer-motion';
import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DefaultPP from '../../assets/defaultPP.png';
import './profileModal.scss';

export default function ProfileModal({ isOpen, onClose }) {
    const { logout, checkAuthError, user: authUser, triggerRefresh } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const fileInputRef = useRef(null);
    const API_URI = import.meta.env.VITE_API_URI;

    useEffect(() => {
        if (authUser) {
            setUser(authUser);
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, [authUser]);

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Prévisualisation immédiate
            const reader = new FileReader();
            reader.onload = (e) => {
                const updatedUser = { ...user, profilePic: e.target.result };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);

            // Upload vers le serveur
            const formData = new FormData();
            formData.append('profilePic', file);

            const response = await fetch(`${API_URI}/user/updateProfilePic/${user._id}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: formData
            });

            if (checkAuthError(response)) return;

            const data = await response.json();
            triggerRefresh();
            
            // Mise à jour avec la réponse du serveur
            const updatedUser = { 
                ...user, 
                profilePic: data.profilePic || user.profilePic
            };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
        }
    };

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

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleEditUsername = () => {
        setIsEditingUsername(true);
        setNewUsername(user?.username || '');
    };

    const handleSaveUsername = async () => {
        if (!newUsername.trim() || !user) return;

        try {
            const response = await fetch(`${API_URI}/user/updateUsername/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (checkAuthError(response)) return;

            const data = await response.json();
            triggerRefresh();
            const updatedUser = { ...user, username: newUsername };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditingUsername(false);
            
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    if (!isOpen || !user) return null;

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
                                backgroundImage: `url('${getProfilePicUrl()}')`,
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
                                    <button onClick={handleSaveUsername} className='Save__button'>
                                        Sauvegarder
                                    </button>
                                </>
                            ) : (
                                <>
                                    {user.username}
                                    <button onClick={handleEditUsername}>✎</button>
                                </>
                            )}
                        </p>
                        
                        <p><span>Email :</span> {user.email}</p>
                        <p><span>Parties jouées :</span> {user.stats?.gamesPlayed || 0}</p>
                        <p><span>Score moyen :</span> {user.stats?.averageScore || 0}/20</p>
                        <p><span>Niveau :</span> {user.stats?.level || 1}</p>
                        <p><span>XP :</span> {user.stats?.xp || 0}</p>
                        
                        <button onClick={logout} className="logout-button">
                            Se déconnecter
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}