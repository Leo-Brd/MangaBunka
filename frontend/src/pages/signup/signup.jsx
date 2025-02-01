import './signup.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faImage } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Signup() {
    return (
        <main id="signup">
            <div className="signup__container">
                <h1>Créer un compte</h1>
                <form>
                    <div className="input-group">
                        <FontAwesomeIcon icon={faUser} />
                        <input type="text" placeholder="Pseudo" required />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input type="email" placeholder="Email" required />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faLock} />
                        <input type="password" placeholder="Mot de passe" required />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faLock} />
                        <input type="password" placeholder="Confirmer le mot de passe" required />
                    </div>

                    <div className="input-group">
                        <FontAwesomeIcon icon={faImage} />
                        <input type="file" accept="image/*" />
                    </div>

                    <button type="submit" className="signup__button">S'inscrire</button>
                </form>

                <div className="signup__google">
                    <button className="google__button">
                        <FontAwesomeIcon icon={faGoogle} /> S'inscrire avec Google
                    </button>
                </div>

                <p className="signup__loginLink">Déjà un compte ? <a href="/login">Connectez-vous ici</a></p>
            </div>
        </main>
    );
}
