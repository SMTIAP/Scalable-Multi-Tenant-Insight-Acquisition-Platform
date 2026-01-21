import React, { useState } from 'react';
import './LoginPage.css';

interface Message {
  type: string;
  text: string;
}

interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ 
    score: 0, 
    text: '', 
    color: '' 
  });
  const [socialUser, setSocialUser] = useState<any>(null);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength checker
  const checkPasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };

    score = Object.values(checks).filter(Boolean).length;

    const strengthMap: { [key: number]: { text: string; color: string } } = {
      0: { text: '', color: '' },
      1: { text: 'Very Weak', color: '#ef4444' },
      2: { text: 'Weak', color: '#f97316' },
      3: { text: 'Fair', color: '#eab308' },
      4: { text: 'Good', color: '#22c55e' },
      5: { text: 'Strong', color: '#10b981' }
    };

    return { score, ...strengthMap[score] };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (!isLogin && pwd) {
      setPasswordStrength(checkPasswordStrength(pwd));
    }
  };

  // Signup
  const signup = async (): Promise<void> => {
    setErrors([]);
    setMessage({ type: '', text: '' });

    // Client-side validation
    const validationErrors: string[] = [];
    
    if (!email) {
      validationErrors.push('Email is required');
    } else if (!validateEmail(email)) {
      validationErrors.push('Invalid email format');
    }

    if (!password) {
      validationErrors.push('Password is required');
    } else {
      if (password.length < 8) validationErrors.push('Password must be at least 8 characters');
      if (!/[A-Z]/.test(password)) validationErrors.push('Must contain uppercase letter');
      if (!/[a-z]/.test(password)) validationErrors.push('Must contain lowercase letter');
      if (!/[0-9]/.test(password)) validationErrors.push('Must contain a number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) validationErrors.push('Must contain special character');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `Signup Success! Email: ${data.email}` });
        setEmail('');
        setPassword('');
        setPasswordStrength({ score: 0, text: '', color: '' });
      } else {
        setErrors(data.errors && data.errors.length > 0 ? data.errors : [data.message]);
      }
    } catch (err) {
      console.error(err);
      setErrors(['Network error. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (): Promise<void> => {
    setErrors([]);
    setMessage({ type: '', text: '' });

    if (!email || !password) {
      setErrors(['Please fill in all fields']);
      return;
    }

    if (!validateEmail(email)) {
      setErrors(['Invalid email format']);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setErrors([data.message]);
      }
    } catch (err) {
      console.error(err);
      setErrors(['Network error. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  // Social login popup
  const socialLogin = (provider: string): void => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(
      `http://localhost:3000/auth/${provider}`,
      'Social Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Listen for social login response
    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:3000') return;
      setSocialUser(event.data);
      popup?.close();
    });
  };

  const handleToggleMode = (): void => {
    setIsLogin(!isLogin);
    setErrors([]);
    setMessage({ type: '', text: '' });
    setPasswordStrength({ score: 0, text: '', color: '' });
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="login-subtitle">
              {isLogin ? 'Login to your account' : 'Sign up to get started'}
            </p>
          </div>

          {/* Body */}
          <div className="login-body">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="message-box error-box">
                {errors.map((error, idx) => (
                  <div key={idx} className="message-item">
                    <span className="message-icon">⚠</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Success Message */}
            {message.text && (
              <div className={`message-box ${message.type === 'success' ? 'success-box' : 'info-box'}`}>
                <div className="message-item">
                  <span className="message-icon">✓</span>
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="form-input password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {!isLogin && password && (
                <div className="password-strength">
                  <div className="strength-header">
                    <span className="strength-label">Password Strength:</span>
                    <span className="strength-text" style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={isLogin ? login : signup}
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <span className="loading-content">
                  <span className="loading-spinner">⏳</span>
                  Processing...
                </span>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </button>

            {/* Toggle Login/Signup */}
            <div className="toggle-mode">
              <button onClick={handleToggleMode} className="toggle-button">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or continue with</span>
              <div className="divider-line" />
            </div>

            {/* Social Login Buttons */}
            <div className="social-buttons">
              <button onClick={() => socialLogin('google')} className="social-button">
                <span className="social-icon">🌐</span>
                <span className="social-text">Google</span>
              </button>
              <button onClick={() => socialLogin('facebook')} className="social-button">
                <span className="social-icon">📘</span>
                <span className="social-text">Facebook</span>
              </button>
            </div>

            {/* Social User Info */}
            {socialUser && (
              <div className="social-user-info">
                <h3 className="social-user-title">Social User Info</h3>
                <pre className="social-user-data">
                  {JSON.stringify(socialUser, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default LoginPage;