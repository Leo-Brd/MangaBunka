import './login.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
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

            localStorage.setItem('token', data.token);

            navigate('/');
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

                    {error && <p className="login__error">{error}</p>}

                    <button type="submit" className="Login__button">Se connecter</button>
                </form>

                <p className="Login__signupLink">
                    Pas encore inscrit ? <Link to="/signup">Créer un compte</Link>
                </p>
            </section>
        </main>
    );
}