// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// RANKINGS PAGE
// Requirement 3.1 - Player Ranking System
// -----------------------------------------------
const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Filter by position
  const [position, setPosition] = useState('All');

  const { token } = useAuth();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/analytics/rankings',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRankings(res.data.rankings);
      } catch (err) {
        setError('Failed to fetch rankings ❌');
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [token]);

  // Filter rankings by position
  const filtered = position === 'All'
    ? rankings
    : rankings.filter(p => p.position === position);

  // Get color based on rank
  const getRankColor = (index) => {
    if (index === 0) return '#FFD700'; // Gold
    if (index === 1) return '#C0C0C0'; // Silver
    if (index === 2) return '#CD7F32'; // Bronze
    return '#006400';
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/analytics' style={styles.backBtn}>← Analytics</Link>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>🏅 Player Rankings</h2>

        {/* Position filter */}
        <div style={styles.filterRow}>
          <label style={styles.filterLabel}>Filter by Position:</label>
          <select
            style={styles.select}
            value={position}
            onChange={e => setPosition(e.target.value)}
          >
            <option value='All'>All Positions</option>
            <option value='GK'>GK - Goalkeeper</option>
            <option value='CB'>CB - Center Back</option>
            <option value='FB'>FB - Full Back</option>
            <option value='CDM'>CDM - Defensive Mid</option>
            <option value='CM'>CM - Center Mid</option>
            <option value='CAM'>CAM - Attacking Mid</option>
            <option value='Winger'>Winger</option>
            <option value='ST'>ST - Striker</option>
          </select>
        </div>

        {loading && <p>Loading rankings...</p>}
        {error   && <p style={styles.error}>{error}</p>}

        {/* Rankings table */}
        {!loading && (
          <div style={styles.table}>

            {/* Table header */}
            <div style={styles.tableHeader}>
              <span style={styles.col1}>Rank</span>
              <span style={styles.col2}>Player</span>
              <span style={styles.col3}>Position</span>
              <span style={styles.col4}>Club</span>
              <span style={styles.col5}>Avg Skill</span>
            </div>

            {/* Table rows */}
            {filtered.map((player, index) => (
              <div key={player._id} style={styles.tableRow}>
                <span style={{
                  ...styles.col1,
                  color: getRankColor(index),
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <span style={styles.col2}>
                  <strong>{player.name}</strong>
                  <br />
                  <small style={{ color: '#999' }}>Age: {player.age}</small>
                </span>
                <span style={styles.col3}>
                  <span style={styles.posBadge}>{player.position}</span>
                </span>
                <span style={styles.col4}>{player.club}</span>
                <span style={{
                  ...styles.col5,
                  color: player.avgSkill >= 70 ? '#006400' :
                         player.avgSkill >= 50 ? '#FF8C00' : '#cc0000',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}>
                  {player.avgSkill}
                </span>
              </div>
            ))}

            {/* No players */}
            {filtered.length === 0 && (
              <p style={styles.noData}>No players found for this position</p>
            )}
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
  filterRow:   { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  filterLabel: { fontSize: '14px', fontWeight: 'bold' },
  select: {
    padding: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  table: {
    backgroundColor: '#fff', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex', backgroundColor: '#006400',
    color: '#fff', padding: '15px 20px', fontWeight: 'bold',
  },
  tableRow: {
    display: 'flex', padding: '15px 20px',
    borderBottom: '1px solid #f0f0f0', alignItems: 'center',
  },
  col1:        { width: '80px' },
  col2:        { flex: 2, fontSize: '14px' },
  col3:        { flex: 1 },
  col4:        { flex: 2, fontSize: '14px', color: '#666' },
  col5:        { width: '100px', textAlign: 'center' },
  posBadge: {
    backgroundColor: '#e8f5e9', color: '#006400',
    padding: '3px 10px', borderRadius: '10px', fontSize: '12px',
  },
  error:       { color: 'red' },
  noData:      { padding: '20px', textAlign: 'center', color: '#999' },
};

export default Rankings;