import { useNavigate } from 'react-router-dom';
import './POCHub.css';

const POCHub = () => {
  const navigate = useNavigate();

  const pocList = [
    { id: 1, title: 'QR Code Generator', icon: '📱', description: 'Generate and scan QR codes', color: '#4CAF50' },
    { id: 2, title: 'Cloudflare Integration', icon: '☁️', description: 'CDN, security, and edge computing', color: '#F48024' },
    { id: 3, title: 'AI Analytical Tools', icon: '🤖', description: 'Machine learning and analytics', color: '#2196F3' },
    { id: 4, title: 'Send/Receive Emails', icon: '📧', description: 'Email automation and management', color: '#FF9800' },
    { id: 5, title: 'Social Logins', icon: '🔐', description: 'OAuth with Google, Facebook, etc.', color: '#9C27B0' },
    { id: 6, title: 'Payment Processing', icon: '💳', description: 'Stripe, PayPal integrations', color: '#673AB7', path: '/poc/PaymentPOC' },
    { id: 7, title: 'Password Hashing', icon: '🔒', description: 'Secure password storage', color: '#F44336' },
  ];

  return (
    <div className="poc-container">
      <header className="poc-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>Proof of Concepts Hub</h1>
        <p className="header-subtitle">Select a POC to explore implementation details</p>
      </header>

      <div className="poc-grid">
        {pocList.map((poc) => (
          <button
            key={poc.id}
            className="poc-card"
            style={{ '--card-color': poc.color } as React.CSSProperties}
            onClick={() => navigate(poc.path as string)}
          >
            <div className="poc-icon" style={{ backgroundColor: `${poc.color}20` }}>
              <span style={{ color: poc.color, fontSize: '2rem' }}>{poc.icon}</span>
            </div>
            <h3>{poc.title}</h3>
            <p>{poc.description}</p>
            <div className="poc-status">
              <span className="status-label">Coming Soon</span>
            </div>
          </button>
        ))}
      </div>

      <div className="instructions">
        <h3>📋 Implementation Details:</h3>
        <ul>
          <li>Click any POC card to view its implementation.</li>
          <li>Each POC includes working code examples</li>
          <li>APIs and integrations are ready to test</li>
        </ul>
      </div>
    </div>
  );
};

export default POCHub;