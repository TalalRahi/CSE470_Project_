// Import useState
import { useState } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import useNavigate and Link for navigation
import { useNavigate, Link } from 'react-router-dom';

// -----------------------------------------------
// CREATE TRIAL PAGE
// Only Coach and Admin can create trials
// Requirement 4.2
// -----------------------------------------------
const CreateTrial = () => {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    location:    '',
    trialDate:   '',
  });

  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!form.title || !form.description || !form.location || !form.trialDate) {
      setError('Please fill in all fields ❌');
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        'http://localhost:5000/api/trials',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Trial created successfully ✅');
      setTimeout(() => navigate('/trials'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trial ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/trials' style={styles.backBtn}>← Back to Trials</Link>
      </div>

      <div style={styles.formBox}>
        <h2 style={styles.title}>🎯 Create Trial / Camp</h2>

        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input style={styles.input} name='title'
          placeholder='Trial Title *'
          value={form.title} onChange={handleChange} />

        <textarea style={styles.textarea} name='description'
          placeholder='Description *'
          value={form.description} onChange={handleChange} />

        <input style={styles.input} name='location'
          placeholder='Location *'
          value={form.location} onChange={handleChange} />

        <input style={styles.input} name='trialDate'
          type='date'
          value={form.trialDate} onChange={handleChange} />

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : '🎯 Create Trial'}
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
  textarea: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
    minHeight: '100px', resize: 'vertical',
  },
  button: {
    padding: '12px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', fontSize: '16px',
    cursor: 'pointer',
  },
  error:      { color: 'red', fontSize: '14px', textAlign: 'center' },
  success:    { color: 'green', fontSize: '14px', textAlign: 'center' },
};

export default CreateTrial;