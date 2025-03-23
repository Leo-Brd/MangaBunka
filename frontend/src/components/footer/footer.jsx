import './footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    return (
        <footer>
            <p>By Leo-Brd</p>

            <a href="https://github.com/Leo-Brd">
                <FontAwesomeIcon className="Header__icons" icon={faGithub} />
            </a>

            <a href="https://www.linkedin.com/in/leo-bordet/">
                <FontAwesomeIcon className="Header__icons" icon={faLinkedin} />
            </a>

            <a href="https://discord.com/users/leo_brd">
                <FontAwesomeIcon className="Header__icons" icon={faDiscord} />
            </a>
        
        </footer>
    )
}