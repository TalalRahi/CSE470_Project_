// Import useState to handle form inputs
import { useState } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import useNavigate and Link for navigation
import { useNavigate, Link } from 'react-router-dom';

// -----------------------------------------------
// ADD PLAYER PAGE
// Player creates their own basic profile
// Coach can also add a player profile
// Skills are set separately by Coach
// -----------------------------------------------
const AddPlayer = () => {

  // Store all form values (no skills here!)
  const [form, setForm] = useState({
    name:           '',
    age:            '',
    region:         '',
    club:           '',
    height:         '',
    weight:         '',
    medicalHistory: 'None',
    position:       'ST',
    dominantFoot:   'Right',
  });

  // Store error and success messages
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Get token from AuthContext
  const { token } = useAuth();

  // Get navigate function
  const navigate = useNavigate();

  // -----------------------------------------------
  // HANDLE INPUT CHANGE
  // Updates form state when user types
  // -----------------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------------------------
  // HANDLE SUBMIT
  // Sends player data to backend
  // -----------------------------------------------
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Check required fields
    if (!form.name || !form.age || !form.region || !form.club) {
      setError('Please fill in all required fields ❌');
      return;
    }

    try {
      setLoading(true);

      // Send POST request with token in header
      await axios.post(
        'http://localhost:5000/api/players',
        form,
        {
          headers: {
            // Send token so backend knows who we are
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Profile created successfully ✅');

      // Redirect after 2 seconds
      setTimeout(() => navigate('/players'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/dashboard' style={styles.backBtn}>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Form */}
      <div style={styles.formBox}>
        <h2 style={styles.title}>➕ Create Player Profile</h2>

        {/* Error and success messages */}
        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* Basic Info */}
        <h3 style={styles.section}>Basic Info</h3>
        <input style={styles.input} name='name'
          placeholder='Full Name *'
          value={form.name} onChange={handleChange} />
        <input style={styles.input} name='age'
          placeholder='Age *' type='number'
          value={form.age} onChange={handleChange} />
        <input style={styles.input} name='region'
          placeholder='Region/City *'
          value={form.region} onChange={handleChange} />
        <input style={styles.input} name='club'
          placeholder='Club/School *'
          value={form.club} onChange={handleChange} />

        {/* Physical Info */}
        <h3 style={styles.section}>Physical Info</h3>
        <input style={styles.input} name='height'
          placeholder='Height (cm)' type='number'
          value={form.height} onChange={handleChange} />
        <input style={styles.input} name='weight'
          placeholder='Weight (kg)' type='number'
          value={form.weight} onChange={handleChange} />
        <input style={styles.input} name='medicalHistory'
          placeholder='Medical History'
          value={form.medicalHistory} onChange={handleChange} />

        {/* Position and Foot */}
        <h3 style={styles.section}>Position and Foot</h3>
        <select style={styles.input} name='position'
          value={form.position} onChange={handleChange}>
          <option value='GK'>GK - Goalkeeper</option>
          <option value='CB'>CB - Center Back</option>
          <option value='FB'>FB - Full Back</option>
          <option value='CDM'>CDM - Defensive Mid</option>
          <option value='CM'>CM - Center Mid</option>
          <option value='CAM'>CAM - Attacking Mid</option>
          <option value='Winger'>Winger</option>
          <option value='ST'>ST - Striker</option>
        </select>

        <select style={styles.input} name='dominantFoot'
          value={form.dominantFoot} onChange={handleChange}>
          <option value='Right'>Right Foot</option>
          <option value='Left'>Left Foot</option>
          <option value='Both'>Both Feet</option>
        </select>

        {/* Submit button */}
        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </button>

      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  navbar: {
    backgroundColor: '#006400',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle:  { color: '#fff', fontSize: '20px' },
  backBtn:   { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  formBox: {
    maxWidth: '600px',
    margin: '40px auto',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title:   { textAlign: 'center', color: '#006400' },
  section: {
    color: '#006400',
    borderBottom: '1px solid #eee',
    paddingBottom: '5px',
    marginTop: '10px',
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
    marginTop: '10px',
  },
  error:   { color: 'red', fontSize: '14px', textAlign: 'center' },
  success: { color: 'green', fontSize: '14px', textAlign: 'center' },
};

export default AddPlayer;