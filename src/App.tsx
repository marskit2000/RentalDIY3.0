import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PdfGenerateSection from './components/PdfGenerateSection';
import LandingPage from './components/LandingPage';
import Pricing from './components/Pricing';
import Navbar from './components/Navbar';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { t } from './translations';
import { Link } from 'react-router-dom';
import Checkout from './components/Checkout';
import Return from './components/Return';
import PaymentSuccess from './components/PaymentSuccess';

function AppContent() {
  const { language } = useLanguage();

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" className="App-Title-Link">
            <h1>{t(language, 'appTitle')}</h1>
          </Link>  
          <div className="header-right">
            <div className="header-right-desktop">
              <Navbar />
              <LanguageSelector />
            </div>
            <div className="header-right-mobile">
              <LanguageSelector />
              <Navbar />
            </div>
          </div>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/rental-agreement" element={<PdfGenerateSection />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/return" element={<Return />} />
            <Route path="/payment-success" element={<PaymentSuccess email={''} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
