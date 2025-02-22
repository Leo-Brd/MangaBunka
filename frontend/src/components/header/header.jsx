import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Logo from '../../assets/logo2.png'
import './header.scss';

export default function Header() {

    const { isLoggedIn, logout } = useContext(AuthContext);

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
                        <button onClick={logout}>
                            Se déconnecter
                        </button>
                    ) : (
                        <Link to="/login">
                            Se connecter
                        </Link>
                )}
            </div>

        </header>
    )
}