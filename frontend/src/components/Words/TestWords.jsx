import styles from './styles/testWords.module.css';
import { useState } from 'react';

const normalizeString = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const TestWords = ({ words }) => {
  const [testLanguage, setTestLanguage] = useState('español');
  const [testMode, setTestMode] = useState('endless');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [currentWord, setCurrentWord] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [count, setCount] = useState(0);
  const [maxWords, setMaxWords] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState([]);
  const [testFinished, setTestFinished] = useState(false);

  const allLevels = Array.from(new Set(words.map(w => w.nivel))).sort((a, b) => a - b);
  const filteredWords = selectedLevel === 'Todos'
    ? words
    : words.filter(w => w.nivel === selectedLevel);

  const startTest = (mode, language) => {
    setTestMode(mode);
    setTestLanguage(language);
    setCount(0);
    setScore(0);
    setErrors([]);
    setTestFinished(false);

    if (mode === 'easy') setMaxWords(10);
    else if (mode === 'medium') setMaxWords(20);
    else if (mode === 'hard') setMaxWords(30);
    else setMaxWords(null);

    loadRandomWord();
  };

  const loadRandomWord = () => {
    if (filteredWords.length === 0) {
      setCurrentWord(null);
      return;
    }
    const newWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setCurrentWord(newWord);
    setAnswer('');
    setResult(null);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (!currentWord) return;

    const correctAnswer = testLanguage === 'español' ? currentWord.portugues : currentWord.español;
    const isCorrect = normalizeString(answer) === normalizeString(correctAnswer);

    if (isCorrect) {
      setResult('correcto');
      setScore(score + 1);
    } else {
      setResult('incorrecto');
      setErrors([
        ...errors,
        {
          displayedWord: testLanguage === 'español' ? currentWord.español : currentWord.portugues,
          correctTranslation: correctAnswer,
        },
      ]);
    }

    setCount(count + 1);
  };

  const nextOrFinish = () => {
    if (maxWords && count >= maxWords) {
      setTestFinished(true);
      setCurrentWord(null);
    } else {
      loadRandomWord();
    }
  };

  const finishInfinite = () => {
    setTestFinished(true);
    setCurrentWord(null);
  };

  const restartTest = () => {
    setTestFinished(false);
    setCurrentWord(null);
    setAnswer('');
    setResult(null);
    setCount(0);
    setScore(0);
    setErrors([]);
  };

  return (
    <div>
      <h2>Test de vocabulario</h2>

      {!currentWord && !testFinished && (
        <div className={styles.chooseContainer}>
          <label>
            Mostrar palabra en:
            <select
              value={testLanguage}
              onChange={e => setTestLanguage(e.target.value)}
            >
              <option value="español">Español</option>
              <option value="portugues">Portugués</option>
            </select>
          </label>

          <label>
            Modo:
            <select
              value={testMode}
              onChange={e => setTestMode(e.target.value)}
            >
              <option value="endless">Endless</option>
              <option value="hard">Hard (30 palabras)</option>
              <option value="medium">Medium (20 palabras)</option>
              <option value="easy">Easy (10 palabras)</option>
            </select>
          </label>

          <label>
            Nivel:
            <select
              value={selectedLevel}
              onChange={e =>
                setSelectedLevel(
                  e.target.value === 'Todos'
                    ? 'Todos'
                    : parseInt(e.target.value)
                )
              }
            >
              <option value="Todos">Todos</option>
              {allLevels.map(level => (
                <option key={level} value={level}>
                  Nivel {level}
                </option>
              ))}
            </select>
          </label>

          <br />
          <button onClick={() => startTest(testMode, testLanguage)}>Comenzar Test</button>
        </div>
      )}

      {currentWord && !testFinished && (
        <div>
          <p><strong>Palabra:</strong> {testLanguage === 'español' ? currentWord.español : currentWord.portugues}</p>
          <p>Palabras respondidas: {count}{maxWords ? ` / ${maxWords}` : ''}</p>

          {result === null && (
            <form onSubmit={checkAnswer}>
              <input
                type="text"
                placeholder="Escribe la traducción"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" className={styles.checkAnswer}>Comprobar</button>
            </form>
          )}

          {result === 'correcto' && (
            <div>
              ¡Correcto! 🎉<br />
              La forma correcta es: <strong>{testLanguage === 'español' ? currentWord.portugues : currentWord.español}</strong>
              <br />
              <button onClick={nextOrFinish} className={styles.nextWord}>Siguiente palabra</button>
            </div>
          )}

          {result === 'incorrecto' && (
            <div>
              Incorrecto ❌<br />
              La respuesta correcta era: <strong>{testLanguage === 'español' ? currentWord.portugues : currentWord.español}</strong>
              <br />
              <button onClick={nextOrFinish} className={styles.nextWord}>Siguiente palabra</button>
            </div>
          )}

          {testMode === 'endless' && (
            <button onClick={finishInfinite} className={styles.finishTry}>Finalizar intento</button>
          )}
        </div>
      )}

      {testFinished && (
        <div>
          <h3>Test finalizado</h3>
          <p>Puntuación: {score} de {count}</p>
          {errors.length > 0 ? (
            <>
              <h3>Errores</h3>
              <table>
                <thead>
                  <tr>
                    <th>Palabra</th>
                    <th>Traducción correcta</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((err, i) => (
                    <tr key={i}>
                      <td>{err.displayedWord}</td>
                      <td>{err.correctTranslation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>¡Has acertado todas las palabras! 🎉</p>
          )}
          <button onClick={restartTest}>
            Volver a Test
          </button>
        </div>
      )}
    </div>
  );
}

export default TestWords;