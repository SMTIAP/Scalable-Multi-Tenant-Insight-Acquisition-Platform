import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">Team 21 Test Platform</h1>
        <p className="subtitle">
          A collection of proof-of-concepts for various features and APIs
        </p>
        
        <div className="cta-section">
          <button 
            className="poc-button"
            onClick={() => navigate('/poc-hub')}
          >
            <span className="button-text">View POCs</span>
            <span className="button-icon">🚀</span>
          </button>
          
          <p className="cta-description">
            Access implementations of AI Analytics, QR codes, authentication, payments, and other POCs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;