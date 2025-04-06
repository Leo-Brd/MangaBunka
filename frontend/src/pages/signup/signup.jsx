import './signup.scss';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../context/AuthContext';

export default function Signup() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const API_URI = import.meta.env.VITE_API_URI;
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URI}/auth/signup`, {
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);
        setError(null);
        
        try {
            // 1. Validation du token reçu
            if (!credentialResponse?.credential) {
                throw new Error('Aucun token reçu de Google');
            }
    
            // 2. Envoi au backend
            const response = await fetch(`${API_URI}/auth/google`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    credential: credentialResponse.credential
                })
            });
    
            // 3. Gestion de la réponse
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erreur serveur');
            }
    
            const { token, user } = await response.json();
    
            // 4. Stockage sécurisé
            localStorage.setItem('authToken', token);
            
            // 5. Mise à jour du state global (ex: Redux/Context)
            login(token, user);
            
            // 6. Redirection
            navigate('/');
    
        } catch (err) {
            console.error('Échec connexion Google:', err);
            setError(err.message || 'Échec de la connexion. Veuillez réessayer.');
            
            // Optionnel : Effacer le token en cas d'erreur
            localStorage.removeItem('authToken');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Échec de la connexion avec Google');
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
                            minLength="6"
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
                            minLength="6"
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button 
                        type="submit" 
                        className="signup__button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Chargement...' : 'S\'inscrire'}
                    </button>
                </form>

                <div className="signup__divider">
                    <span>Ou</span>
                </div>

                <div className="signup__google">
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        auto_select
                        ux_mode="popup"
                        text="continue_with"
                        shape="rectangular"
                    />
                    </GoogleOAuthProvider>
                </div>

                <p className="signup__loginLink">
                    Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
                </p>
            </div>
        </main>
    );
}