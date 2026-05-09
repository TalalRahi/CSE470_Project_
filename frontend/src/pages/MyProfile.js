// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token and user info
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// MY PROFILE PAGE
// Players can view and edit their own profile
// -----------------------------------------------
const MyProfile = () => {
  // Store player profile
  const [player, setPlayer]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Store edit form
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saveMsg, setSaveMsg] = useState('');

  // Get token from AuthContext
  const { token } = useAuth();

  // -----------------------------------------------
  // FETCH MY PROFILE
  // -----------------------------------------------
  const fetchMyProfile = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/players/myprofile',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayer(res.data.player);
      setForm(res.data.player);
    } catch (err) {
      setError('No profile found. Please create one! ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyProfile(); }, [token]);

  // -----------------------------------------------
  // HANDLE SAVE
  // -----------------------------------------------
  const handleSave = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/players/myprofile',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaveMsg('Profile updated successfully ✅');
      setEditing(false);
      fetchMyProfile();
    } catch (err) {
      setSaveMsg('Failed to update profile ❌');
    }
  };

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>;

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/dashboard' style={styles.backBtn}>← Dashboard</Link>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>👤 My Profile</h2>

        {saveMsg && <p style={styles.success}>{saveMsg}</p>}

        {/* No profile yet */}
        {error && (
          <div style={styles.noProfile}>
            <p>{error}</p>
            <Link to='/add-player' style={styles.createBtn}>
              ➕ Create My Profile
            </Link>
          </div>
        )}

        {/* Profile found */}
        {player && !editing && (
          <div style={styles.card}>
            <h3 style={styles.playerName}>{player.name}</h3>
            <p style={styles.position}>
              {player.position} | {player.dominantFoot} Foot
            </p>
            <div style={styles.details}>
              <p>🎂 Age: {player.age}</p>
              <p>📍 Region: {player.region}</p>
              <p>🏟️ Club: {player.club}</p>
              <p>📏 Height: {player.height} cm</p>
              <p>⚖️ Weight: {player.weight} kg</p>
              <p>🏥 Medical: {player.medicalHistory}</p>
            </div>

            {/* Skills */}
            <h4 style={styles.sectionTitle}>Skills:</h4>
            <div style={styles.skills}>
              <p>⚡ Pace: {player.skills?.pace}</p>
              <p>🎯 Shooting: {player.skills?.shooting}</p>
              <p>🅿️ Passing: {player.skills?.passing}</p>
              <p>🏃 Dribbling: {player.skills?.dribbling}</p>
              <p>🛡️ Tackling: {player.skills?.tackling}</p>
              <p>💪 Stamina: {player.skills?.stamina}</p>
            </div>

            {/* Performance History */}
            <h4 style={styles.sectionTitle}>Performance History:</h4>
            {player.performanceHistory?.length === 0
              ? <p style={styles.noData}>No match history yet</p>
              : player.performanceHistory?.map(p => (
                <div key={p._id} style={styles.perfCard}>
                  <p><strong>{p.matchName}</strong> vs {p.opponent}</p>
                  <p>📅 {new Date(p.matchDate).toDateString()}</p>
                  <p>
                    ⏱ {p.minutesPlayed}min |
                    ⚽ {p.goals} goals |
                    🅰️ {p.assists} assists |
                    🟨 {p.yellowCards} |
                    🟥 {p.redCards}
                  </p>
                  <p>⭐ Rating: {p.rating}/10</p>
                </div>
              ))
            }

            {/* Edit button */}
            <button
              style={styles.editBtn}
              onClick={() => setEditing(true)}
            >
              ✏️ Edit My Info
            </button>
          </div>
        )}

        {/* Edit form */}
        {player && editing && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>✏️ Edit My Info</h3>

            <input style={styles.input} placeholder='Name'
              value={form.name || ''}
              onChange={e => setForm({...form, name: e.target.value})} />
            <input style={styles.input} placeholder='Age' type='number'
              value={form.age || ''}
              onChange={e => setForm({...form, age: e.target.value})} />
            <input style={styles.input} placeholder='Region'
              value={form.region || ''}
              onChange={e => setForm({...form, region: e.target.value})} />
            <input style={styles.input} placeholder='Club'
              value={form.club || ''}
              onChange={e => setForm({...form, club: e.target.value})} />
            <input style={styles.input} placeholder='Height (cm)' type='number'
              value={form.height || ''}
              onChange={e => setForm({...form, height: e.target.value})} />
            <input style={styles.input} placeholder='Weight (kg)' type='number'
              value={form.weight || ''}
              onChange={e => setForm({...form, weight: e.target.value})} />
            <input style={styles.input} placeholder='Medical History'
              value={form.medicalHistory || ''}
              onChange={e => setForm({...form, medicalHistory: e.target.value})} />

            <select style={styles.input}
              value={form.position || 'ST'}
              onChange={e => setForm({...form, position: e.target.value})}>
              <option value='GK'>GK - Goalkeeper</option>
              <option value='CB'>CB - Center Back</option>
              <option value='FB'>FB - Full Back</option>
              <option value='CDM'>CDM - Defensive Mid</option>
              <option value='CM'>CM - Center Mid</option>
              <option value='CAM'>CAM - Attacking Mid</option>
              <option value='Winger'>Winger</option>
              <option value='ST'>ST - Striker</option>
            </select>

            <select style={styles.input}
              value={form.dominantFoot || 'Right'}
              onChange={e => setForm({...form, dominantFoot: e.target.value})}>
              <option value='Right'>Right Foot</option>
              <option value='Left'>Left Foot</option>
              <option value='Both'>Both Feet</option>
            </select>

            <div style={styles.btnRow}>
              <button style={styles.saveBtn} onClick={handleSave}>
                💾 Save Changes
              </button>
              <button style={styles.cancelBtn} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
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
  content:     { padding: '40px', maxWidth: '700px', margin: '0 auto' },
  title:       { fontSize: '24px', marginBottom: '20px' },
  card: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  playerName:  { fontSize: '22px', color: '#006400' },
  position:    { color: '#666', fontSize: '14px' },
  details:     { fontSize: '14px', lineHeight: '2' },
  sectionTitle:{ color: '#006400', fontSize: '16px', fontWeight: 'bold' },
  skills:      { fontSize: '14px', lineHeight: '2' },
  perfCard: {
    backgroundColor: '#f9f9f9', padding: '12px',
    borderRadius: '8px', fontSize: '13px', lineHeight: '1.8',
  },
  noData:      { color: '#999', fontSize: '14px' },
  editBtn: {
    padding: '10px 20px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer',
    fontSize: '14px', marginTop: '10px',
  },
  input: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  btnRow:      { display: 'flex', gap: '10px' },
  saveBtn: {
    padding: '10px 20px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  cancelBtn: {
    padding: '10px 20px', backgroundColor: '#ccc', color: '#333',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  noProfile:   { textAlign: 'center', padding: '40px' },
  createBtn: {
    display: 'inline-block', marginTop: '15px', padding: '12px 24px',
    backgroundColor: '#006400', color: '#fff', borderRadius: '5px',
    textDecoration: 'none', fontSize: '16px',
  },
  success:     { color: 'green', fontSize: '14px' },
};

export default MyProfile;