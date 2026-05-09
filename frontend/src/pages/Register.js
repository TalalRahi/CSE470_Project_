// Import useState to handle form inputs
import { useState } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useNavigate to redirect after register
import { useNavigate, Link } from 'react-router-dom';

// -----------------------------------------------
// REGISTER PAGE
// User enters name, email, password and role
// We send it to backend and create account
// -----------------------------------------------
const Register = () => {
  // Store form input values
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('Player');

  // Store error and success messages
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Store loading state
  const [loading, setLoading] = useState(false);

  // Get navigate function to redirect to login
  const navigate = useNavigate();

  // -----------------------------------------------
  // HANDLE REGISTER
  // Runs when user clicks Register button
  // -----------------------------------------------
  const handleRegister = async () => {
    // Clear previous messages
    setError('');
    setSuccess('');

    // Check if fields are empty
    if (!name || !email || !password) {
      setError('Please fill in all fields ❌');
      return;
    }

    try {
      // Show loading
      setLoading(true);

      // Send POST request to backend register route
      await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password, role }
      );

      // Show success message
      setSuccess('Registered successfully! Redirecting to login... ✅');

      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      // Show error message from backend
      setError(err.response?.data?.message || 'Registration failed ❌');
    } finally {
      // Hide loading
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        {/* Title */}
        <h1 style={styles.title}>⚽ Bangladesh Football</h1>
        <h2 style={styles.subtitle}>Register</h2>

        {/* Error message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Success message */}
        {success && <p style={styles.success}>{success}</p>}

        {/* Name input */}
        <input
          style={styles.input}
          type='text'
          placeholder='Full Name'
          value={name}
          onChange={e => setName(e.target.value)}
        />

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

        {/* Role dropdown - only Coach and Player */}
        <select
          style={styles.input}
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value='Player'>Player</option>
          <option value='Coach'>Coach</option>
        </select>

        {/* Register button */}
        <button
          style={styles.button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Link to login page */}
        <p style={styles.link}>
          Already have an account? <Link to='/login'>Login</Link>
        </p>

      </div>
    </div>
  );
};

// -----------------------------------------------
// STYLES
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
  success: {
    color: 'green',
    fontSize: '14px',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    fontSize: '14px',
  },
};

export default Register;