// Import useState
import { useState } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import useParams to get player id from URL
import { useParams, useNavigate, Link } from 'react-router-dom';

// -----------------------------------------------
// ADD PERFORMANCE PAGE
// Only Coach and Admin can access this page
// Used to add match performance for a player
// -----------------------------------------------
const AddPerformance = () => {

  // Get player id from URL
  const { id } = useParams();

  // Store form values
  const [form, setForm] = useState({
    matchName:     '',
    matchDate:     '',
    opponent:      '',
    minutesPlayed: 0,
    goals:         0,
    assists:       0,
    yellowCards:   0,
    redCards:      0,
    rating:        5,
    notes:         '',
  });

  // Store error and success messages
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Get token from AuthContext
  const { token } = useAuth();
  const navigate  = useNavigate();

  // -----------------------------------------------
  // HANDLE INPUT CHANGE
  // -----------------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------------------------
  // HANDLE SUBMIT
  // Sends performance data to backend
  // -----------------------------------------------
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Check required fields
    if (!form.matchName || !form.matchDate || !form.opponent) {
      setError('Please fill in all required fields ❌');
      return;
    }

    try {
      setLoading(true);

      // Send POST request to backend
      await axios.post(
        `http://localhost:5000/api/players/${id}/performance`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Performance added successfully ✅');

      // Redirect to players page after 2 seconds
      setTimeout(() => navigate('/players'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add performance ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/players' style={styles.backBtn}>
          ← Back to Players
        </Link>
      </div>

      {/* Form */}
      <div style={styles.formBox}>
        <h2 style={styles.title}>📊 Add Performance</h2>

        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* Match Info */}
        <h3 style={styles.section}>Match Info</h3>
        <input style={styles.input} name='matchName'
          placeholder='Match Name *'
          value={form.matchName} onChange={handleChange} />
        <input style={styles.input} name='matchDate'
          type='date'
          value={form.matchDate} onChange={handleChange} />
        <input style={styles.input} name='opponent'
          placeholder='Opponent Team *'
          value={form.opponent} onChange={handleChange} />

        {/* Stats */}
        <h3 style={styles.section}>Match Stats</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statField}>
            <label style={styles.label}>Minutes Played</label>
            <input style={styles.statInput} name='minutesPlayed'
              type='number' min='0' max='120'
              value={form.minutesPlayed} onChange={handleChange} />
          </div>
          <div style={styles.statField}>
            <label style={styles.label}>Goals</label>
            <input style={styles.statInput} name='goals'
              type='number' min='0'
              value={form.goals} onChange={handleChange} />
          </div>
          <div style={styles.statField}>
            <label style={styles.label}>Assists</label>
            <input style={styles.statInput} name='assists'
              type='number' min='0'
              value={form.assists} onChange={handleChange} />
          </div>
          <div style={styles.statField}>
            <label style={styles.label}>Yellow Cards</label>
            <input style={styles.statInput} name='yellowCards'
              type='number' min='0' max='2'
              value={form.yellowCards} onChange={handleChange} />
          </div>
          <div style={styles.statField}>
            <label style={styles.label}>Red Cards</label>
            <input style={styles.statInput} name='redCards'
              type='number' min='0' max='1'
              value={form.redCards} onChange={handleChange} />
          </div>
          <div style={styles.statField}>
            <label style={styles.label}>Rating (1-10)</label>
            <input style={styles.statInput} name='rating'
              type='number' min='1' max='10'
              value={form.rating} onChange={handleChange} />
          </div>
        </div>

        {/* Notes */}
        <h3 style={styles.section}>Notes</h3>
        <textarea style={styles.textarea} name='notes'
          placeholder='Any notes about this performance...'
          value={form.notes} onChange={handleChange} />

        {/* Submit button */}
        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Adding...' : '📊 Add Performance'}
        </button>

      </div>
    </div>
  );
};

// Styles
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
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  title:      { textAlign: 'center', color: '#006400' },
  section: {
    color: '#006400', borderBottom: '1px solid #eee',
    paddingBottom: '5px', marginTop: '10px',
  },
  input: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  statField:  { display: 'flex', flexDirection: 'column', gap: '5px' },
  label:      { fontSize: '13px', color: '#555', fontWeight: 'bold' },
  statInput: {
    padding: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
    textAlign: 'center',
  },
  textarea: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
    minHeight: '100px', resize: 'vertical',
  },
  button: {
    padding: '12px', backgroundColor: '#0047AB', color: '#fff',
    border: 'none', borderRadius: '5px', fontSize: '16px',
    cursor: 'pointer', marginTop: '10px',
  },
  error:      { color: 'red', fontSize: '14px', textAlign: 'center' },
  success:    { color: 'green', fontSize: '14px', textAlign: 'center' },
};

export default AddPerformance;