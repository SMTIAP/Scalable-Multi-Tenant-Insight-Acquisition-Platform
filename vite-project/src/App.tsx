import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import POCHub from './pages/POCHub';
import PaymentPOC from './pages/poc/PaymentPOC';
import DataAnalysisPage from './pages/DataAnalysis';
import QRCodeGenerator from './pages/poc/qrPOC/QRCodeGenerator';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/poc-hub" element={<POCHub />} />
        <Route path="/data-analysis" element={<DataAnalysisPage />} />
        <Route path="/poc/qrPOC" element={<QRCodeGenerator />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/poc/PaymentPOC" element={<PaymentPOC />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;