import './login.scss';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const API_URI = import.meta.env.VITE_API_URI;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_URI}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Erreur lors de la connexion.');
                return;
            }

            login(data.token, data.user);
            
        } catch (err) {
            setError('Veuillez réessayer plus tard.');
        }
    };
    

    return (
        <main id="login">
            <section className="login__container">
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FontAwesomeIcon icon={faUser} className="Login__icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faLock} className="Login__icon" />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="Login__error">{error}</p>}

                    <button type="submit" className="Login__button">Se connecter</button>
                </form>

                <p className="Login__signupLink">
                    Pas encore inscrit ? <Link to="/signup">Créer un compte</Link>
                </p>
            </section>
        </main>
    );
}