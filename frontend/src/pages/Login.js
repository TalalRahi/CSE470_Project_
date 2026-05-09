// Import useState to handle form inputs
import { useState } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to access login function
import { useAuth } from '../context/AuthContext';

// Import useNavigate to redirect after login
import { useNavigate, Link } from 'react-router-dom';

// -----------------------------------------------
// LOGIN PAGE
// User enters email and password
// We send it to backend and get token back
// -----------------------------------------------
const Login = () => {
  // Store form input values
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // Store error message if login fails
  const [error, setError] = useState('');

  // Store loading state while waiting for response
  const [loading, setLoading] = useState(false);

  // Get login function from AuthContext
  const { login } = useAuth();

  // Get navigate function to redirect to dashboard
  const navigate = useNavigate();

  // -----------------------------------------------
  // HANDLE LOGIN
  // Runs when user clicks Login button
  // -----------------------------------------------
  const handleLogin = async () => {
    // Clear previous errors
    setError('');

    // Check if fields are empty
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Show loading
      setLoading(true);

      // Send POST request to backend login route
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      // Save user info and token to AuthContext
      // and localStorage
      login(res.data.user, res.data.token);

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      // Show error message from backend
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      // Hide loading
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        {/* Title */}
        <h1 style={styles.title}> Bangladesh Football Tracker</h1>
        <h2 style={styles.subtitle}>Login</h2>

        {/* Error message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Email input */}
        <input
          style={styles.input}
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {/* Password input */}
        <input
          style={styles.input}
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {/* Login button */}
        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Link to register page */}
        <p style={styles.link}>
          Don't have an account? <Link to='/register'>Register</Link>
        </p>

      </div>
    </div>
  );
};

// -----------------------------------------------
// STYLES
// Simple inline styles for the login page
// -----------------------------------------------
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  box: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  title: {
    textAlign: 'center',
    color: '#006400',
    fontSize: '22px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
    fontSize: '18px',
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#006400',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    fontSize: '14px',
  },
};

export default Login;