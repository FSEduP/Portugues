import styles from './styles/addWord.module.css';
import { useState } from 'react';

function AddWord({ words, setWords }) {
  const [portuguese, setPortuguese] = useState('');
  const [spanish, setSpanish] = useState('');
  const [level, setLevel] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portugues: portuguese, español: spanish, nivel: level })
    });

    if (res.ok) {
      const newWord = await res.json();
      setWords([...words, newWord]);
      setPortuguese('');
      setSpanish('');
      setLevel('');
      setMessage('Palabra añadida');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error al añadir palabra');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <h2>Añadir palabra</h2>
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
        <button type="submit">Añadir palabra</button>
      </form>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}

export default AddWord;