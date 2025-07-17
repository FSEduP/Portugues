import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Page/Header';
import Home from './components/Page/Home';
import Footer from './components/Page/Footer';
import AddWord from './components/Words/AddWord';
import Vocabulary from './components/Words/Vocabulary';
import TestWords from './components/Words/TestWords';
import EditWord from './components/Words/EditWord';
import AddPhrase from './components/Phrases/AddPhrase';
import Phrases from './components/Phrases/Phrases';
import TestPhrases from './components/Phrases/TestPhrases';
import EditPhrase from './components/Phrases/EditPhrase';

const App = () => {
  const [words, setWords] = useState([]);

  const fetchWords = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/words');
      const data = await res.json();
      setWords(data);
    } catch (error) {
      console.error('Error al obtener palabras:', error);
    }
  };

  const [phrases, setPhrases] = useState([]);

  const fetchPhrases = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/phrases');
      const data = await res.json();
      setPhrases(data);
    } catch (error) {
      console.error('Error al obtener frases:', error);
    }
  };

  useEffect(() => {
    fetchWords();
    fetchPhrases();
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/añadirPalabra" element={<AddWord words={words} setWords={setWords} />} />
            <Route path="/editar" element={<EditWord words={words} setWords={setWords} />} />
            <Route path="/vocabulario" element={<Vocabulary words={words} />} />
            <Route path="/testVocabulario" element={<TestWords words={words} />} />
            <Route path="/añadirFrase" element={<AddPhrase phrases={phrases} setPhrases={setPhrases} />} />
            <Route path="/editarFrase" element={<EditPhrase phrases={phrases} setPhrases={setPhrases} />} />
            <Route path="/frases" element={<Phrases phrases={phrases} />} />
            <Route path="/testFrases" element={<TestPhrases phrases={phrases} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;