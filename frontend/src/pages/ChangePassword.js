// Import useState
import { useState } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// CHANGE PASSWORD PAGE
// Requirement 0 - Password Management
// -----------------------------------------------
const ChangePassword = () => {
  const [oldPassword, setOldPassword]   = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields ❌');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match ❌');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters ❌');
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        'http://localhost:5000/api/auth/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Password changed successfully ✅');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/dashboard' style={styles.backBtn}>← Dashboard</Link>
      </div>

      <div style={styles.formBox}>
        <h2 style={styles.title}>🔐 Change Password</h2>

        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input style={styles.input}
          type='password'
          placeholder='Current Password *'
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)} />

        <input style={styles.input}
          type='password'
          placeholder='New Password *'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)} />

        <input style={styles.input}
          type='password'
          placeholder='Confirm New Password *'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)} />

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Changing...' : '🔐 Change Password'}
        </button>

      </div>
    </div>
  );
};

const styles = {
  container:  { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#006400', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  navTitle:   { color: '#fff', fontSize: '20px' },
  backBtn:    { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  formBox: {
    maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff',
    padding: '40px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column', gap: '15px',
  },
  title:      { textAlign: 'center', color: '#006400' },
  input: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  button: {
    padding: '12px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', fontSize: '16px',
    cursor: 'pointer',
  },
  error:      { color: 'red', fontSize: '14px', textAlign: 'center' },
  success:    { color: 'green', fontSize: '14px', textAlign: 'center' },
};

export default ChangePassword;