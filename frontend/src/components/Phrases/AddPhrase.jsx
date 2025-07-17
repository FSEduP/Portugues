import styles from './styles/addPhrase.module.css';
import { useState } from 'react';

function AddPhrase({ phrases, setPhrases }) {
  const [portuguese, setPortuguese] = useState('');
  const [spanish, setSpanish] = useState('');
  const [level, setLevel] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/api/phrases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portugues: portuguese, español: spanish, nivel: level })
    });

    if (res.ok) {
      const newPhrase = await res.json();
      setPhrases([...phrases, newPhrase]);
      setPortuguese('');
      setSpanish('');
      setLevel('');
      setMessage('Frase añadida');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error al añadir la frase');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <h2>Añadir frase</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          type="text"
          placeholder="Portugués"
          value={portuguese}
          onChange={e => setPortuguese(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Español"
          value={spanish}
          onChange={e => setSpanish(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Nivel"
          value={level}
          onChange={e => setLevel(e.target.value)}
          required
          min="1"
        />
        <button type="submit">Añadir frase</button>
      </form>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}

export default AddPhrase;