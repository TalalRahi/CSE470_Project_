// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import useParams to get player id from URL
import { useParams, Link } from 'react-router-dom';

// -----------------------------------------------
// PERFORMANCE TREND PAGE
// Requirement 3.2 - Performance Trend Analysis
// -----------------------------------------------
const Trends = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [limit, setLimit]     = useState(10);

  const { playerId } = useParams();
  const { token }    = useAuth();

  const fetchTrend = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/trends/${playerId}?limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(res.data);

    } catch (err) {
      setError('Failed to fetch trend data ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrend(); }, [playerId, limit, token]);

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>;

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/players' style={styles.backBtn}>← Back to Players</Link>
      </div>

      <div style={styles.content}>

        {error && <p style={styles.error}>{error}</p>}

        {data && (
          <>
            <h2 style={styles.title}>📈 Performance Trend</h2>

            {/* Player info */}
            <div style={styles.playerBox}>
              <h3 style={styles.playerName}>{data.playerName}</h3>
              <p style={styles.playerPos}>{data.position}</p>
            </div>

            {/* Limit selector */}
            <div style={styles.limitBox}>
              <label style={styles.label}>Show last</label>
              <select
                style={styles.select}
                value={limit}
                onChange={e => setLimit(parseInt(e.target.value))}
              >
                <option value={5}>5 Matches</option>
                <option value={10}>10 Matches</option>
                <option value={15}>15 Matches</option>
              </select>
              <p style={styles.count}>Matches analyzed: {data.matchesAnalyzed}</p>
            </div>

            {/* Trend summary */}
            {data.trend ? (
              <div style={styles.trendBox}>
                <div style={styles.trendHeader}>
                  <h3 style={styles.trendStatus}>{data.trend.status}</h3>
                </div>

                <div style={styles.statsGrid}>
                  <div style={styles.stat}>
                    <p style={styles.statLabel}>⚽ Avg Goals</p>
                    <p style={styles.statValue}>{data.trend.avgGoals}</p>
                  </div>
                  <div style={styles.stat}>
                    <p style={styles.statLabel}>🅰️ Avg Assists</p>
                    <p style={styles.statValue}>{data.trend.avgAssists}</p>
                  </div>
                  <div style={styles.stat}>
                    <p style={styles.statLabel}>⭐ Avg Rating</p>
                    <p style={styles.statValue}>{data.trend.avgRating}</p>
                  </div>
                  <div style={styles.stat}>
                    <p style={styles.statLabel}>⏱ Avg Minutes</p>
                    <p style={styles.statValue}>{data.trend.avgMinutes}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p style={styles.noData}>No performance history yet</p>
            )}

            {/* Match history */}
            {data.history && data.history.length > 0 && (
              <div style={styles.historyBox}>
                <h3 style={styles.historyTitle}>📋 Match History</h3>

                {data.history.map((match, index) => (
                  <div key={index} style={styles.matchRow}>
                    <div style={styles.matchInfo}>
                      <p style={styles.matchName}>{match.matchName}</p>
                      <p style={styles.matchDate}>
                        vs {match.opponent} - {new Date(match.matchDate).toDateString()}
                      </p>
                    </div>
                    <div style={styles.matchStats}>
                      <span>⏱ {match.minutesPlayed}m</span>
                      <span>⚽ {match.goals}g</span>
                      <span>🅰️ {match.assists}a</span>
                      <span>⭐ {match.rating}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </>
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
  playerBox: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px',
    textAlign: 'center',
  },
  playerName:  { color: '#006400', fontSize: '22px' },
  playerPos:   { color: '#666', fontSize: '14px' },
  limitBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginBottom: '20px',
  },
  label:       { fontSize: '14px', fontWeight: 'bold' },
  select: {
    padding: '8px 12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  count:       { margin: '0', fontSize: '12px', color: '#999' },
  trendBox: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px',
  },
  trendHeader: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' },
  trendStatus: { color: '#006400', fontSize: '20px', margin: '0' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  stat: {
    backgroundColor: '#f9f9f9', padding: '15px',
    borderRadius: '8px', textAlign: 'center',
  },
  statLabel:   { fontSize: '13px', color: '#666', margin: '0 0 5px' },
  statValue:   { fontSize: '24px', fontWeight: 'bold', color: '#006400', margin: '0' },
  historyBox: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  historyTitle:{ color: '#006400', marginBottom: '15px' },
  matchRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '15px',
    borderBottom: '1px solid #f0f0f0',
  },
  matchInfo:   { flex: 1 },
  matchName:   { fontWeight: 'bold', fontSize: '14px', margin: '0 0 5px' },
  matchDate:   { fontSize: '12px', color: '#999', margin: '0' },
  matchStats: {
    display: 'flex', gap: '10px', fontSize: '12px', color: '#555',
  },
  error:       { color: 'red' },
  noData:      { textAlign: 'center', color: '#999', padding: '20px' },
};

export default Trends;