import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import QRCode from 'qrcode';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  const generateQR = async () => {
    if (!text) return;
    try {
      const url = await QRCode.toDataURL(text);
      setQrUrl(url);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="qr-container">
      <header className="qr-header">
        <button
          className="back-button"
          onClick={() => navigate('/poc-hub')}
        >
          ← Back to POC Hub
        </button>

        <h1>QR Code Generator</h1>
        
      </header>

      {/* SHOW INPUT ONLY IF QR NOT GENERATED */}
      {!qrUrl && (
        <div className="qr-input-row">
          <input
            type="text"
            placeholder="Enter link or text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={generateQR}>Generate QR</button>
        </div>
      )}

      {/* SHOW QR + DOWNLOAD ONLY IF QR GENERATED */}
      {qrUrl && (
        <div className="qr-output">
          <img
            src={qrUrl}
            alt="Generated QR Code"
            className="qr-image"
          />
          <button
            className="download-btn"
            onClick={downloadQR}
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
