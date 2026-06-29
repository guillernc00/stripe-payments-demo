import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Tokenize from './pages/Tokenize.jsx';
import TokenizeSuccess from './pages/TokenizeSuccess.jsx';
import Purchase from './pages/Purchase.jsx';
import ViewCards from './pages/ViewCards.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tokenize" element={<Tokenize />} />
      <Route path="/tokenize/success" element={<TokenizeSuccess />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="/view-cards" element={<ViewCards />} />
    </Routes>
  );
}

export default App;