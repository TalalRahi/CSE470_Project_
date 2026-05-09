// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// LEADERBOARDS PAGE
// Requirement 3.5 - Top Performers
// -----------------------------------------------
const Leaderboards = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('scorers');

  const { token } = useAuth();

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/analytics/leaderboards',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        setError('Failed to fetch leaderboards ❌');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboards();
  }, [token]);

  // Get current tab data
  const getCurrentData = () => {
    if (!data) return [];
    if (tab === 'scorers')     return data.topScorers;
    if (tab === 'assists')     return data.topAssists;
    if (tab === 'rated')       return data.topRated;
    if (tab === 'cleansheets') return data.topCleanSheets;
    return [];
  };

  // Get stat value based on tab
  const getStatValue = (player) => {
    if (tab === 'scorers')     return `⚽ ${player.totalGoals} Goals`;
    if (tab === 'assists')     return `🅰️ ${player.totalAssists} Assists`;
    if (tab === 'rated')       return `⭐ ${player.avgRating} Rating`;
    if (tab === 'cleansheets') return `🧤 ${player.cleanSheets} Clean Sheets`;
    return '';
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/analytics' style={styles.backBtn}>← Analytics</Link>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>🏆 Leaderboards</h2>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{...styles.tab, ...(tab === 'scorers' ? styles.activeTab : {})}}
            onClick={() => setTab('scorers')}>
            ⚽ Top Scorers
          </button>
          <button
            style={{...styles.tab, ...(tab === 'assists' ? styles.activeTab : {})}}
            onClick={() => setTab('assists')}>
            🅰️ Top Assists
          </button>
          <button
            style={{...styles.tab, ...(tab === 'rated' ? styles.activeTab : {})}}
            onClick={() => setTab('rated')}>
            ⭐ Top Rated
          </button>
          <button
            style={{...styles.tab, ...(tab === 'cleansheets' ? styles.activeTab : {})}}
            onClick={() => setTab('cleansheets')}>
            🧤 Clean Sheets
          </button>
        </div>

        {loading && <p>Loading leaderboards...</p>}
        {error   && <p style={styles.error}>{error}</p>}

        {/* Leaderboard list */}
        {!loading && data && (
          <div style={styles.list}>
            {getCurrentData().map((player, index) => (
              <div key={player._id} style={styles.row}>

                {/* Rank */}
                <span style={styles.rank}>
                  {index === 0 ? '🥇' :
                   index === 1 ? '🥈' :
                   index === 2 ? '🥉' : `#${index + 1}`}
                </span>

                {/* Player info */}
                <div style={styles.playerInfo}>
                  <p style={styles.playerName}>{player.name}</p>
                  <p style={styles.playerMeta}>
                    {player.position} | {player.club} | {player.region}
                  </p>
                </div>

                {/* Stat value */}
                <span style={styles.statValue}>
                  {getStatValue(player)}
                </span>

              </div>
            ))}

            {getCurrentData().length === 0 && (
              <p style={styles.noData}>
                No data available yet. Add some performance history!
              </p>
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
  content:     { padding: '40px', maxWidth: '700px', margin: '0 auto' },
  title:       { fontSize: '28px', marginBottom: '20px' },
  tabs:        { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: {
    padding: '10px 20px', border: 'none', borderRadius: '5px',
    cursor: 'pointer', fontSize: '14px',
    backgroundColor: '#fff', color: '#333',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  activeTab:   { backgroundColor: '#006400', color: '#fff' },
  list: {
    backgroundColor: '#fff', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden',
  },
  row: {
    display: 'flex', alignItems: 'center', padding: '15px 20px',
    borderBottom: '1px solid #f0f0f0', gap: '15px',
  },
  rank:        { fontSize: '24px', width: '50px', textAlign: 'center' },
  playerInfo:  { flex: 1 },
  playerName:  { fontWeight: 'bold', fontSize: '16px', color: '#333' },
  playerMeta:  { fontSize: '12px', color: '#999', marginTop: '3px' },
  statValue:   { fontWeight: 'bold', fontSize: '16px', color: '#006400' },
  error:       { color: 'red' },
  noData:      { padding: '20px', textAlign: 'center', color: '#999' },
};

export default Leaderboards;