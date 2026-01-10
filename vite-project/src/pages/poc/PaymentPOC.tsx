import { useNavigate } from 'react-router-dom';
import './PaymentPOC.css';

const PaymentPOC = () => {
  const navigate = useNavigate();

  return (
    <div className="poc-page">
      <header className="poc-page-header">
        <button className="back-button" onClick={() => navigate('/poc-hub')}>
          ← Back to POC Hub
        </button>
        <h1>QR Code Generator</h1>
        <p className="page-subtitle">Generate and scan QR codes for various use cases</p>
      </header>

      <div className="poc-content">
        <div className="poc-demo-section">
          <h2>Live Demo</h2>
          <div className="demo-placeholder">
            QR Code Generator Component Goes Here
          </div>
        </div>

        <div className="poc-details">
          <h2>Implementation Details</h2>
          <div className="details-grid">
            <div className="detail-card">
              <h3>📦 Dependencies</h3>
              <ul>
                <li>qrcode.react</li>
                <li>html5-qrcode</li>
                <li>React hooks</li>
              </ul>
            </div>
            <div className="detail-card">
              <h3>⚙️ Features</h3>
              <ul>
                <li>Generate QR codes from text/URLs</li>
                <li>Customizable size and colors</li>
                <li>Scan QR codes from camera</li>
                <li>Download as PNG/SVG</li>
              </ul>
            </div>
            <div className="detail-card">
              <h3>🔧 Usage</h3>
              <pre><code>{`import QRCode from 'qrcode.react';

<QRCode 
  value="https://example.com"
  size={256}
  bgColor="#ffffff"
  fgColor="#000000"
/>`}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPOC;