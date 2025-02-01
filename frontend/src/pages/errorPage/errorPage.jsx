import './errorPage.scss';
import zoroImage from '../../assets/zoro.webp';

export default function ErrorPage() {
    return (
        <main id="error">
            <div className='Errorpage__left'>
                <h1>404</h1>
                <p>Même les meilleurs sabreurs se perdent...</p>
            </div>
            <img src={zoroImage} alt="Image de Roronoa Zoro"/>
        </main>
    )
}