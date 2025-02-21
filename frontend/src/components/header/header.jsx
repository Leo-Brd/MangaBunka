import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo2.png'
import './header.scss';

export default function Header() {
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
                <Link to="/login">
                    Se connecter
                </Link>
            </div>

        </header>
    )
}