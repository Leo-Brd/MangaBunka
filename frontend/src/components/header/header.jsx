import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Logo from '../../assets/logo.png'
import DefaultPP from '../../assets/defaultPP.png';
import './header.scss';

export default function Header() {

    const { isLoggedIn, logout } = useContext(AuthContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [isLoggedIn]);

    return (
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
                        <button onClick={logout}>
                            Se déconnecter
                        </button>
                        {user && (
                            <div className='Header__user'>
                                <img 
                                    src={ user.profilePic || DefaultPP } 
                                    alt="Profile" 
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
    )
}