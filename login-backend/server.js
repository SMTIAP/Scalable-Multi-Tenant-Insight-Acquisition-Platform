import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import session from 'express-session';

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// In-memory user storage (replace with database in production)
const users = [];

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '509575551849-vq398f35njohbrnbimjucn2u7a58hpna.apps.googleusercontent.com',
      clientSecret: '0CvqRg4y10KB8XdeuSgglVm3ousH',
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('\n========== GOOGLE LOGIN ==========');
      console.log(`Email: ${profile.emails[0].value}`);
      console.log(`Name: ${profile.displayName}`);
      console.log(`Google ID: ${profile.id}`);
      console.log('==================================\n');

      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        googleId: profile.id,
        provider: 'google',
      };
      return done(null, user);
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: '2101079493761419',
      clientSecret: 'dafa90dc868f5e01f1fe3e3c7020cfc8',
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'emails', 'displayName'],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('\n========== FACEBOOK LOGIN ==========');
      console.log(`Email: ${profile.emails ? profile.emails[0].value : 'No email'}`);
      console.log(`Name: ${profile.displayName}`);
      console.log(`Facebook ID: ${profile.id}`);
      console.log('====================================\n');

      const user = {
        id: profile.id,
        email: profile.emails ? profile.emails[0].value : 'No email',
        name: profile.displayName,
        facebookId: profile.id,
        provider: 'facebook',
      };
      return done(null, user);
    }
  )
);

// Password validation function
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain a number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Must contain special character');
  }
  return errors;
};

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Signup endpoint
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = [];

    // Validation
    if (!email) {
      errors.push('Email is required');
    } else if (!validateEmail(email)) {
      errors.push('Invalid email format');
    } else if (users.find(u => u.email === email)) {
      errors.push('Email already registered');
    }

    if (!password) {
      errors.push('Password is required');
    } else {
      const passwordErrors = validatePassword(password);
      errors.push(...passwordErrors);
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('\n========== NEW USER REGISTERED ==========');
    console.log(`Email: ${email}`);
    console.log(`Hashed Password: ${hashedPassword}`);
    console.log('=========================================\n');

    // Create user
    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'Signup successful!',
      email: email
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return success with user info (without password)
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage({
            success: true,
            provider: 'google',
            user: ${JSON.stringify(req.user)}
          }, 'http://localhost:5173');
          window.close();
        </script>
      </body>
    </html>
  `);
});

// Facebook OAuth Routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage({
            success: true,
            provider: 'facebook',
            user: ${JSON.stringify(req.user)}
          }, 'http://localhost:5173');
          window.close();
        </script>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Login backend is running' });
});

// Debug endpoint - view all registered users with hashed passwords
app.get('/debug/users', (req, res) => {
  res.status(200).json({
    totalUsers: users.length,
    users: users.map(u => ({
      id: u.id,
      email: u.email,
      hashedPassword: u.password,
      createdAt: u.createdAt
    }))
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Login backend running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  POST http://localhost:${PORT}/auth/signup`);
  console.log(`  POST http://localhost:${PORT}/auth/login`);
  console.log(`  GET  http://localhost:${PORT}/auth/google`);
  console.log(`  GET  http://localhost:${PORT}/auth/facebook`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  GET  http://localhost:${PORT}/debug/users`);
});
