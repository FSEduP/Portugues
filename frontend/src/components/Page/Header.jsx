import styles from './styles/header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}><h1>Aprende Portugués</h1></Link>
      <nav>
        <ul>
          <li><Link to="/añadirPalabra">Añadir Palabra</Link></li>
          <li><Link to="/editar">Editar Palabra</Link></li>
          <li><Link to="/vocabulario">Ver Vocabulario</Link></li>
          <li><Link to="/testVocabulario">Test Palabras</Link></li>
          <li><Link to="/añadirFrase">Añadir Frase</Link></li>
          <li><Link to="/editarFrase">Editar Frases</Link></li>
          <li><Link to="/frases">Ver Frases</Link></li>
          <li><Link to="/testFrases">Test Frases</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;