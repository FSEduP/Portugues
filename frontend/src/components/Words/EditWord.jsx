import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/editWord.module.css';

const normalizeString = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const EditWord = ({ words, setWords }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [portuguese, setPortuguese] = useState('');
  const [spanish, setSpanish] = useState('');
  const [level, setLevel] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) {
      setError('Por favor, escribe algo para buscar');
      return;
    }
    setError('');
    const filtered = words.filter(w =>
      normalizeString(w.portugues).includes(normalizeString(search)) ||
      normalizeString(w.español).includes(normalizeString(search))
    );
    setResults(filtered);
    setSelected(null);
  };

  const selectWord = (word) => {
    setSelected(word);
    setPortuguese(word.portugues);
    setSpanish(word.español);
    setLevel(word.nivel ?? '');
    setResults([]);
    setError('');
  };

  const saveChanges = async () => {
    if (!portuguese || !spanish) return;

    const res = await fetch(`http://localhost:4000/api/words/${selected._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portugues: portuguese, español: spanish, nivel: level }),
    });

    if (!res.ok) {
      setError('Error al guardar los cambios');
      return;
    }

    const updated = await res.json();

    const newWords = words.map(w =>
      w._id === updated._id ? updated : w
    );
    setWords(newWords);
    navigate('/vocabulario');
  };

  if (selected) {
    return (
      <div className={styles.editContainer}>
        <label>
          Portugués:
          <input
            type="text"
            value={portuguese}
            onChange={(e) => setPortuguese(e.target.value)}
          />
        </label>
        <br />
        <label>
          Español:
          <input
            type="text"
            value={spanish}
            onChange={(e) => setSpanish(e.target.value)}
          />
        </label>
        <br />
        <label>
          Nivel:
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
        </label>
        <br />
        <button onClick={saveChanges}>Guardar</button>
        <button onClick={() => setSelected(null)}>Volver</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    );
  }

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Buscar palabra"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <ul className={styles.resultsList}>
        {results.map(w => (
          <li key={w._id}>
            <span>{w.portugues} - {w.español} (Nivel: {w.nivel ?? 'N/A'})</span>
            <button onClick={() => selectWord(w)}>Seleccionar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditWord;