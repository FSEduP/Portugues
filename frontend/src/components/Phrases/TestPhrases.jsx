import styles from './styles/testPhrases.module.css';
import { useState } from 'react';

const normalizeString = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const TestPhrases = ({ phrases }) => {
  const [testLanguage, setTestLanguage] = useState('español');
  const [testMode, setTestMode] = useState('endless');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [count, setCount] = useState(0);
  const [maxPhrases, setMaxPhrases] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState([]);
  const [testFinished, setTestFinished] = useState(false);

  const allLevels = Array.from(new Set(phrases.map(w => w.nivel))).sort((a, b) => a - b);
  const filteredPhrases = selectedLevel === 'Todos'
    ? phrases
    : phrases.filter(w => w.nivel === selectedLevel);

  const startTest = (mode, language) => {
    setTestMode(mode);
    setTestLanguage(language);
    setCount(0);
    setScore(0);
    setErrors([]);
    setTestFinished(false);

    if (mode === 'easy') setMaxPhrases(10);
    else if (mode === 'medium') setMaxPhrases(20);
    else if (mode === 'hard') setMaxPhrases(30);
    else setMaxPhrases(null);

    loadRandomPhrase();
  };

  const loadRandomPhrase = () => {
    if (filteredPhrases.length === 0) {
      setCurrentPhrase(null);
      return;
    }
    const newPhrase = filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
    setCurrentPhrase(newPhrase);
    setAnswer('');
    setResult(null);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (!currentPhrase) return;

    const correctAnswer = testLanguage === 'español' ? currentPhrase.portugues : currentPhrase.español;
    const isCorrect = normalizeString(answer) === normalizeString(correctAnswer);

    if (isCorrect) {
      setResult('correcto');
      setScore(score + 1);
    } else {
      setResult('incorrecto');
      setErrors([
        ...errors,
        {
          displayedPhrase: testLanguage === 'español' ? currentPhrase.español : currentPhrase.portugues,
          correctTranslation: correctAnswer,
        },
      ]);
    }

    setCount(count + 1);
  };

  const nextOrFinish = () => {
    if (maxPhrases && count >= maxPhrases) {
      setTestFinished(true);
      setCurrentPhrase(null);
    } else {
      loadRandomPhrase();
    }
  };

  const finishInfinite = () => {
    setTestFinished(true);
    setCurrentPhrase(null);
  };

  const restartTest = () => {
    setTestFinished(false);
    setCurrentPhrase(null);
    setAnswer('');
    setResult(null);
    setCount(0);
    setScore(0);
    setErrors([]);
  };

  return (
    <div>
      <h2>Test de Frases</h2>

      {!currentPhrase && !testFinished && (
        <div className={styles.chooseContainer}>
          <label>
            Mostrar frase en:
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
              <option value="hard">Hard (30 Frases)</option>
              <option value="medium">Medium (20 Frases)</option>
              <option value="easy">Easy (10 Frases)</option>
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

      {currentPhrase && !testFinished && (
        <div>
          <p><strong>Frase:</strong> {testLanguage === 'español' ? currentPhrase.español : currentPhrase.portugues}</p>
          <p>Frases respondidas: {count}{maxPhrases ? ` / ${maxPhrases}` : ''}</p>

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
              La forma correcta es: <strong>{testLanguage === 'español' ? currentPhrase.portugues : currentPhrase.español}</strong>
              <br />
              <button onClick={nextOrFinish} className={styles.nextWord}>Siguiente Frase</button>
            </div>
          )}

          {result === 'incorrecto' && (
            <div>
              Incorrecto ❌<br />
              La respuesta correcta era: <strong>{testLanguage === 'español' ? currentPhrase.portugues : currentPhrase.español}</strong>
              <br />
              <button onClick={nextOrFinish} className={styles.nextWord}>Siguiente Frase</button>
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
                    <th>Frase</th>
                    <th>Traducción correcta</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((err, i) => (
                    <tr key={i}>
                      <td>{err.displayedPhrase}</td>
                      <td>{err.correctTranslation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>¡Has acertado todas las frases! 🎉</p>
          )}
          <button onClick={restartTest}>
            Volver a Test
          </button>
        </div>
      )}
    </div>
  );
}

export default TestPhrases;