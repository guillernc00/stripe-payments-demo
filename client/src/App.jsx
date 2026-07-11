import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Tokenize from './pages/Tokenize.jsx';
import TokenizeSuccess from './pages/TokenizeSuccess.jsx';
import Purchase from './pages/Purchase.jsx';
import ViewCards from './pages/ViewCards.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tokenize" element={<Tokenize />} />
          <Route path="/tokenize/success" element={<TokenizeSuccess />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/view-cards" element={<ViewCards />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;