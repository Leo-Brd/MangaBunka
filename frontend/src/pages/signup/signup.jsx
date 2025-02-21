import './signup.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Signup() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Une erreur est survenue.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur réseau. Veuillez réessayer.');
        }
    };

    return (
        <main id="signup">
            <div className="signup__container">
                <h1>Créer un compte</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FontAwesomeIcon icon={faUser} />
                        <input 
                            type="text"
                            placeholder="Pseudo"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="signup__button">S'inscrire</button>
                </form>

                <div className="signup__google">
                    <button className="google__button">
                        <FontAwesomeIcon icon={faGoogle} /> S'inscrire avec Google
                    </button>
                </div>

                <p className="signup__loginLink">
                    Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
                </p>
            </div>
        </main>
    );
}
