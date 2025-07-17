import styles from './styles/phrases.module.css';
import { useState, useEffect } from 'react';

const normalizeString = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const Phrases = ({ phrases }) => {
  const [search, setSearch] = useState('');
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchAttempted, setSearchAttempted] = useState(false);

  useEffect(() => {
    const levels = Array.from(new Set(phrases.map(w => w.nivel))).sort((a, b) => a - b);
    setAvailableLevels(levels);
  }, [phrases]);

  const toggleLevel = (level) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const getFilteredAndOrderedPhrases = () => {
    let filtered = phrases;

    if (search.trim() !== '') {
      filtered = filtered.filter(p =>
        normalizeString(p.portugues).includes(normalizeString(search)) ||
        normalizeString(p.español).includes(normalizeString(search))
      );
    }

    if (selectedLevels.length > 0) {
      filtered = filtered.filter(p => selectedLevels.includes(p.nivel));
    }

    return filtered;
  };

  const updateResults = (phrasesList) => {
    setResults(phrasesList);
    setCurrentPage(1);
    setShowResults(true);
  };

  const handleSearch = () => {
    if (search.trim() === '') return;
    const filtered = getFilteredAndOrderedPhrases();
    updateResults(filtered);
    setSearchAttempted(true);
  };

  const handleShowAll = () => {
    setSearch('');
    setSearchAttempted(false);
    const all = getFilteredAndOrderedPhrases();
    updateResults(all);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={styles.vocabularyContainer}>
      <h2>Frases</h2>
      <div className={styles.searchContainer}>
        <div>
          <input
            type="text"
            placeholder="Buscar frase"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.levelFilter}>
          <span>Filtrar por nivel:</span>
          {availableLevels.map(level => (
            <label key={level} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={selectedLevels.includes(level)}
                onChange={() => toggleLevel(level)}
              />
              Nivel {level}
            </label>
          ))}
        </div>

        <div className={styles.buttonsGroup}>
          <button onClick={handleSearch} disabled={search.trim() === ''}>Buscar</button>
          <button onClick={handleShowAll}>Mostrar todo</button>
        </div>
      </div>

      {showResults && (
        <>
          {results.length === 0 && searchAttempted ? (
            <p className={styles.notFound}> ❌ No se ha encontrado ninguna coincidencia. Intentalo de nuevo.</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Portugués</th>
                    <th>Español</th>
                  </tr>
                </thead>
                <tbody>
                  {currentResults.map((p, i) => (
                    <tr key={i}>
                      <td>{p.portugues}</td>
                      <td>{p.español}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Siguiente
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Phrases;