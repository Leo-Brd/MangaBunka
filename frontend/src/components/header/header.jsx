import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from '../../assets/logo2.png'
import './header.scss';

export default function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

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
                        <button onClick={handleLogout} className="Header__button--logout">
                            Se déconnecter
                        </button>
                    ) : (
                        <Link to="/login" className="Header__button--login">
                            Se connecter
                        </Link>
                )}
            </div>

        </header>
    )
}