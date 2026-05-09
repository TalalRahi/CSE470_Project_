// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// COMPARE PLAYERS PAGE
// Requirement 3.3 - Player Comparison Tool
// -----------------------------------------------
const Compare = () => {
  const [players, setPlayers]   = useState([]);
  const [player1, setPlayer1]   = useState('');
  const [player2, setPlayer2]   = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const { token } = useAuth();

  // Fetch all players for dropdowns
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/players',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPlayers(res.data.players);
      } catch (err) {
        setError('Failed to load players ❌');
      }
    };
    fetchPlayers();
  }, [token]);

  // Compare two players
  const handleCompare = async () => {
    if (!player1 || !player2) {
      setError('Please select both players ❌');
      return;
    }
    if (player1 === player2) {
      setError('Please select two different players ❌');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/analytics/compare?player1=${player1}&player2=${player2}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError('Failed to compare players ❌');
    } finally {
      setLoading(false);
    }
  };

  // Skill bar component
  const SkillBar = ({ skill, val1, val2 }) => (
    <div style={styles.skillRow}>
      <span style={styles.skillName}>{skill}</span>
      <div style={styles.barContainer}>
        <div style={{ ...styles.bar1, width: `${val1}%` }}>{val1}</div>
      </div>
      <div style={styles.barContainer}>
        <div style={{ ...styles.bar2, width: `${val2}%` }}>{val2}</div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/analytics' style={styles.backBtn}>← Analytics</Link>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>⚖️ Compare Players</h2>

        {/* Player selection */}
        <div style={styles.selectRow}>
          <div style={styles.selectBox}>
            <label style={styles.label}>Player 1</label>
            <select style={styles.select}
              value={player1}
              onChange={e => setPlayer1(e.target.value)}>
              <option value=''>Select Player 1</option>
              {players.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.vsBox}>VS</div>

          <div style={styles.selectBox}>
            <label style={styles.label}>Player 2</label>
            <select style={styles.select}
              value={player2}
              onChange={e => setPlayer2(e.target.value)}>
              <option value=''>Select Player 2</option>
              {players.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleCompare} disabled={loading}>
          {loading ? 'Comparing...' : '⚖️ Compare Now'}
        </button>

        {/* Comparison result */}
        {result && (
          <div style={styles.result}>

            {/* Player headers */}
            <div style={styles.playerHeaders}>
              <div style={styles.p1Header}>
                <h3>{result.player1.name}</h3>
                <p>{result.player1.position} | Age: {result.player1.age}</p>
                <p>{result.player1.club}</p>
                <p style={styles.avgSkill}>
                  Avg Skill: {result.player1.avgSkill}
                </p>
              </div>
              <div style={styles.vsMiddle}>VS</div>
              <div style={styles.p2Header}>
                <h3>{result.player2.name}</h3>
                <p>{result.player2.position} | Age: {result.player2.age}</p>
                <p>{result.player2.club}</p>
                <p style={styles.avgSkill}>
                  Avg Skill: {result.player2.avgSkill}
                </p>
              </div>
            </div>

            {/* Skills comparison */}
            <h3 style={styles.sectionTitle}>Skills Comparison</h3>
            <div style={styles.skillsBox}>
              {['dribbling', 'passing', 'tackling', 'shooting', 'pace', 'stamina'].map(skill => (
                <SkillBar
                  key={skill}
                  skill={skill.charAt(0).toUpperCase() + skill.slice(1)}
                  val1={result.player1.skills?.[skill] || 0}
                  val2={result.player2.skills?.[skill] || 0}
                />
              ))}
            </div>

            {/* Performance stats comparison */}
            <h3 style={styles.sectionTitle}>Performance Stats</h3>
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <p>⚽ Goals: {result.player1.stats.totalGoals}</p>
                <p>🅰️ Assists: {result.player1.stats.totalAssists}</p>
                <p>⭐ Avg Rating: {result.player1.stats.avgRating}</p>
                <p>🎮 Matches: {result.player1.stats.matches}</p>
              </div>
              <div style={styles.statBox}>
                <p>⚽ Goals: {result.player2.stats.totalGoals}</p>
                <p>🅰️ Assists: {result.player2.stats.totalAssists}</p>
                <p>⭐ Avg Rating: {result.player2.stats.avgRating}</p>
                <p>🎮 Matches: {result.player2.stats.matches}</p>
              </div>
            </div>

          </div>
        )}
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
  content:     { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  title:       { fontSize: '28px', marginBottom: '20px' },
  selectRow: {
    display: 'flex', gap: '20px', alignItems: 'flex-end',
    marginBottom: '20px', flexWrap: 'wrap',
  },
  selectBox:   { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  label:       { fontSize: '14px', fontWeight: 'bold', color: '#555' },
  select: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  vsBox: {
    fontSize: '24px', fontWeight: 'bold',
    color: '#006400', padding: '10px',
  },
  button: {
    padding: '12px 30px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', fontSize: '16px',
    cursor: 'pointer', marginBottom: '30px',
  },
  result: {
    backgroundColor: '#fff', padding: '30px',
    borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  playerHeaders: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px',
  },
  p1Header: { textAlign: 'left', flex: 1, color: '#006400' },
  p2Header: { textAlign: 'right', flex: 1, color: '#0047AB' },
  vsMiddle: {
    fontSize: '24px', fontWeight: 'bold',
    color: '#999', padding: '0 20px',
  },
  avgSkill:    { fontSize: '20px', fontWeight: 'bold', marginTop: '5px' },
  sectionTitle:{ color: '#006400', fontSize: '16px', margin: '20px 0 10px' },
  skillsBox:   { display: 'flex', flexDirection: 'column', gap: '10px' },
  skillRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  skillName:   { width: '90px', fontSize: '13px', fontWeight: 'bold' },
  barContainer:{ flex: 1, backgroundColor: '#f0f0f0', borderRadius: '5px', height: '24px' },
  bar1: {
    backgroundColor: '#006400', height: '24px',
    borderRadius: '5px', color: '#fff',
    fontSize: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    minWidth: '30px',
  },
  bar2: {
    backgroundColor: '#0047AB', height: '24px',
    borderRadius: '5px', color: '#fff',
    fontSize: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    minWidth: '30px',
  },
  statsRow: {
    display: 'flex', gap: '20px',
  },
  statBox: {
    flex: 1, backgroundColor: '#f9f9f9', padding: '15px',
    borderRadius: '8px', fontSize: '14px', lineHeight: '2',
  },
  error:       { color: 'red', marginBottom: '10px' },
};

export default Compare;