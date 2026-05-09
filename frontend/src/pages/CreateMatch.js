import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const CreateMatch = () => {
  const [form, setForm] = useState({
    matchType:       'League',
    competitionName: '',
    round:           '',
    matchDate:       '',
    venue:           '',
    homeTeamName:    '',
    homeFormation:   '4-3-3',
    awayTeamName:    '',
    awayFormation:   '4-4-2',
  });

  // Players list to build squads
  const [players, setPlayers]       = useState([]);
  const [homeSquad, setHomeSquad]   = useState([]);
  const [awaySquad, setAwaySquad]   = useState([]);

  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate  = useNavigate();

  // Fetch all players to select squad
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/players', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayers(res.data.players);
      } catch (err) {
        console.error('Could not load players');
      }
    };
    fetchPlayers();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Toggle player in home squad
  const toggleHomeSquad = (playerId) => {
    setHomeSquad(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Toggle player in away squad
  const toggleAwaySquad = (playerId) => {
    setAwaySquad(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!form.competitionName || !form.matchDate || !form.venue ||
        !form.homeTeamName || !form.awayTeamName) {
      setError('Please fill in all required fields ❌');
      return;
    }

    try {
      setLoading(true);

      // Build squad arrays with player references
      const homeSquadData = homeSquad.map(id => ({ player: id }));
      const awaySquadData = awaySquad.map(id => ({ player: id }));

      await axios.post(
        'http://localhost:5000/api/matches',
        {
          matchType:       form.matchType,
          competitionName: form.competitionName,
          round:           form.round,
          matchDate:       form.matchDate,
          venue:           form.venue,
          homeTeam: {
            name:      form.homeTeamName,
            formation: form.homeFormation,
            squad:     homeSquadData,
          },
          awayTeam: {
            name:      form.awayTeamName,
            formation: form.awayFormation,
            squad:     awaySquadData,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Match created successfully ✅');
      setTimeout(() => navigate('/matches'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create match ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/matches' style={styles.backBtn}>← Back to Matches</Link>
      </div>

      <div style={styles.formBox}>
        <h2 style={styles.title}>🏆 Create New Match</h2>

        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* Match Info */}
        <h3 style={styles.section}>Match Info</h3>
        <select style={styles.input} name='matchType'
          value={form.matchType} onChange={handleChange}>
          <option value='League'>League</option>
          <option value='Tournament'>Tournament</option>
          <option value='Friendly'>Friendly</option>
        </select>
        <input style={styles.input} name='competitionName'
          placeholder='Competition Name *'
          value={form.competitionName} onChange={handleChange} />
        <input style={styles.input} name='round'
          placeholder='Round (e.g. Group Stage, Quarter Final)'
          value={form.round} onChange={handleChange} />
        <input style={styles.input} name='matchDate'
          type='date' value={form.matchDate} onChange={handleChange} />
        <input style={styles.input} name='venue'
          placeholder='Venue *'
          value={form.venue} onChange={handleChange} />

        {/* Home Team */}
        <h3 style={styles.section}>🏠 Home Team</h3>
        <input style={styles.input} name='homeTeamName'
          placeholder='Home Team Name *'
          value={form.homeTeamName} onChange={handleChange} />
        <select style={styles.input} name='homeFormation'
          value={form.homeFormation} onChange={handleChange}>
          {['4-3-3','4-4-2','3-5-2','4-2-3-1','5-3-2','3-4-3'].map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Home Squad Selection */}
        <p style={styles.squadLabel}>Select Home Squad:</p>
        <div style={styles.squadGrid}>
          {players.map(p => (
            <div
              key={p._id}
              style={{
                ...styles.playerChip,
                backgroundColor: homeSquad.includes(p._id) ? '#006400' : '#eee',
                color: homeSquad.includes(p._id) ? '#fff' : '#333',
              }}
              onClick={() => toggleHomeSquad(p._id)}
            >
              {p.name} ({p.position})
            </div>
          ))}
        </div>

        {/* Away Team */}
        <h3 style={styles.section}>✈️ Away Team</h3>
        <input style={styles.input} name='awayTeamName'
          placeholder='Away Team Name *'
          value={form.awayTeamName} onChange={handleChange} />
        <select style={styles.input} name='awayFormation'
          value={form.awayFormation} onChange={handleChange}>
          {['4-3-3','4-4-2','3-5-2','4-2-3-1','5-3-2','3-4-3'].map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Away Squad Selection */}
        <p style={styles.squadLabel}>Select Away Squad:</p>
        <div style={styles.squadGrid}>
          {players.map(p => (
            <div
              key={p._id}
              style={{
                ...styles.playerChip,
                backgroundColor: awaySquad.includes(p._id) ? '#8B0000' : '#eee',
                color: awaySquad.includes(p._id) ? '#fff' : '#333',
              }}
              onClick={() => toggleAwaySquad(p._id)}
            >
              {p.name} ({p.position})
            </div>
          ))}
        </div>

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Match'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container:   { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#006400', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  navTitle:    { color: '#fff', fontSize: '20px' },
  backBtn:     { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  formBox: {
    maxWidth: '650px', margin: '40px auto', backgroundColor: '#fff',
    padding: '40px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  title:       { textAlign: 'center', color: '#006400' },
  section: {
    color: '#006400', borderBottom: '1px solid #eee',
    paddingBottom: '5px', marginTop: '10px',
  },
  input: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  squadLabel:  { fontSize: '14px', color: '#555', marginTop: '5px' },
  squadGrid:   { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  playerChip: {
    padding: '6px 12px', borderRadius: '20px', fontSize: '13px',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  button: {
    padding: '12px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', fontSize: '16px',
    cursor: 'pointer', marginTop: '10px',
  },
  error:       { color: 'red', fontSize: '14px', textAlign: 'center' },
  success:     { color: 'green', fontSize: '14px', textAlign: 'center' },
};

export default CreateMatch;