// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import useParams to get player id from URL
import { useParams, useNavigate, Link } from 'react-router-dom';

// -----------------------------------------------
// EDIT PLAYER SKILLS PAGE
// Only Coach and Admin can access this page
// -----------------------------------------------
const EditPlayerSkills = () => {

  // Get player id from URL
  const { id } = useParams();

  // Store player info
  const [player, setPlayer]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Store skills form
  const [skills, setSkills] = useState({
    dribbling: 50,
    passing:   50,
    tackling:  50,
    shooting:  50,
    pace:      50,
    stamina:   50,
  });

  // Get token from AuthContext
  const { token } = useAuth();
  const navigate  = useNavigate();

  // -----------------------------------------------
  // FETCH PLAYER INFO
  // -----------------------------------------------
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/players/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPlayer(res.data.player);

        // Load existing skills if they exist
        if (res.data.player.skills) {
          setSkills({
            dribbling: res.data.player.skills.dribbling || 50,
            passing:   res.data.player.skills.passing   || 50,
            tackling:  res.data.player.skills.tackling  || 50,
            shooting:  res.data.player.skills.shooting  || 50,
            pace:      res.data.player.skills.pace      || 50,
            stamina:   res.data.player.skills.stamina   || 50,
          });
        }

      } catch (err) {
        setError('Failed to load player ❌');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id, token]);

  // -----------------------------------------------
  // HANDLE SKILL CHANGE
  // -----------------------------------------------
  const handleSkillChange = (e) => {
    setSkills({
      ...skills,
      [e.target.name]: Number(e.target.value)
    });
  };

  // -----------------------------------------------
  // HANDLE SUBMIT
  // -----------------------------------------------
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      await axios.put(
        `http://localhost:5000/api/players/${id}/skills`,
        { skills },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Skills updated successfully ✅');
      setTimeout(() => navigate('/players'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update skills ❌');
    }
  };

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>;

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/players' style={styles.backBtn}>← Back to Players</Link>
      </div>

      <div style={styles.formBox}>
        <h2 style={styles.title}>⚽ Edit Player Skills</h2>

        {/* Player info */}
        {player && (
          <div style={styles.playerInfo}>
            <h3 style={styles.playerName}>{player.name}</h3>
            <p style={styles.playerPos}>
              {player.position} | {player.dominantFoot} Foot
            </p>
          </div>
        )}

        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* Skills sliders */}
        <h3 style={styles.section}>Skills Rating (1-100)</h3>

        {Object.keys(skills).map(skill => (
          <div key={skill} style={styles.skillRow}>

            {/* Skill name */}
            <label style={styles.skillLabel}>
              {skill.charAt(0).toUpperCase() + skill.slice(1)}
            </label>

            {/* Slider */}
            <input
              type='range'
              name={skill}
              min='1'
              max='100'
              value={skills[skill]}
              onChange={handleSkillChange}
              style={styles.slider}
            />

            {/* Current value */}
            <span style={styles.skillValue}>{skills[skill]}</span>

          </div>
        ))}

        {/* Submit button */}
        <button style={styles.button} onClick={handleSubmit}>
          💾 Save Skills
        </button>

      </div>
    </div>
  );
};

// Styles
const styles = {
  container:   { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#006400', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  navTitle:    { color: '#fff', fontSize: '20px' },
  backBtn:     { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  formBox: {
    maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff',
    padding: '40px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column', gap: '15px',
  },
  title:       { textAlign: 'center', color: '#006400' },
  playerInfo: {
    backgroundColor: '#f0f7f0', padding: '15px',
    borderRadius: '8px', textAlign: 'center',
  },
  playerName:  { color: '#006400', fontSize: '20px' },
  playerPos:   { color: '#666', fontSize: '14px', marginTop: '4px' },
  section: {
    color: '#006400', borderBottom: '1px solid #eee',
    paddingBottom: '5px',
  },
  skillRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  skillLabel:  { width: '90px', fontSize: '14px', fontWeight: 'bold' },
  slider:      { flex: 1, accentColor: '#006400' },
  skillValue: {
    width: '40px', textAlign: 'center', fontWeight: 'bold',
    color: '#006400', fontSize: '16px',
  },
  button: {
    padding: '12px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', fontSize: '16px',
    cursor: 'pointer', marginTop: '10px',
  },
  error:       { color: 'red', fontSize: '14px', textAlign: 'center' },
  success:     { color: 'green', fontSize: '14px', textAlign: 'center' },
};

export default EditPlayerSkills;