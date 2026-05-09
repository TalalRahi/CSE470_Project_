import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const { token, user }       = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/matches', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data.matches);
      } catch (err) {
        setError('Failed to fetch matches ❌');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token]);

  // Helper to show result badge color
  const getWinnerColor = (winner) => {
    if (winner === 'Home') return '#006400';
    if (winner === 'Away') return '#8B0000';
    if (winner === 'Draw') return '#FF8C00';
    return '#999';
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <div style={styles.navRight}>
          {(user?.role === 'Coach' || user?.role === 'Admin') && (
            <Link to='/matches/create' style={styles.addBtn}>➕ Create Match</Link>
          )}
          <Link to='/dashboard' style={styles.backBtn}>← Dashboard</Link>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>🏆 All Matches</h2>

        {loading && <p>Loading matches...</p>}
        {error   && <p style={styles.error}>{error}</p>}

        {!loading && (
          <p style={styles.count}>Total Matches: {matches.length}</p>
        )}

        <div style={styles.grid}>
          {matches.map(match => (
            <div key={match._id} style={styles.card}>

              {/* Competition name and type */}
              <div style={styles.cardHeader}>
                <span style={styles.matchType}>{match.matchType}</span>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor:
                    match.status === 'Completed' ? '#006400' :
                    match.status === 'Ongoing'   ? '#FF8C00' : '#999'
                }}>
                  {match.status}
                </span>
              </div>

              <h3 style={styles.compName}>{match.competitionName}</h3>
              {match.round && (
                <p style={styles.round}>Round: {match.round}</p>
              )}

              {/* Score */}
              <div style={styles.score}>
                <div style={styles.teamBlock}>
                  <p style={styles.teamName}>{match.homeTeam.name}</p>
                  <p style={styles.goals}>{match.homeTeam.goalsScored}</p>
                </div>
                <p style={styles.vs}>VS</p>
                <div style={styles.teamBlock}>
                  <p style={styles.teamName}>{match.awayTeam.name}</p>
                  <p style={styles.goals}>{match.awayTeam.goalsScored}</p>
                </div>
              </div>

              {/* Winner */}
              {match.winner && (
                <p style={{
                  ...styles.winner,
                  color: getWinnerColor(match.winner)
                }}>
                  {match.winner === 'Draw'
                    ? '🤝 Draw'
                    : `🏆 ${match.winner === 'Home'
                        ? match.homeTeam.name
                        : match.awayTeam.name} Won`}
                </p>
              )}

              {/* Details */}
              <div style={styles.details}>
                <p>📅 {new Date(match.matchDate).toDateString()}</p>
                <p>📍 {match.venue}</p>
                <p>👤 By: {match.createdBy?.name}</p>
              </div>

              {/* View button */}
              <Link to={`/matches/${match._id}`} style={styles.viewBtn}>
                View Details →
              </Link>

            </div>
          ))}
        </div>

        {!loading && matches.length === 0 && (
          <p style={styles.noData}>No matches found. Create one! 🏆</p>
        )}
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
  navRight:   { display: 'flex', gap: '15px', alignItems: 'center' },
  addBtn: {
    backgroundColor: '#fff', color: '#006400', padding: '8px 16px',
    borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px',
  },
  backBtn:    { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  content:    { padding: '40px' },
  title:      { fontSize: '24px', marginBottom: '10px' },
  count:      { color: '#666', marginBottom: '20px' },
  grid:       { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  card: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '300px',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  matchType:  { fontSize: '12px', color: '#006400', fontWeight: 'bold' },
  statusBadge: {
    fontSize: '11px', color: '#fff', padding: '3px 8px',
    borderRadius: '10px', fontWeight: 'bold',
  },
  compName:   { fontSize: '16px', fontWeight: 'bold', color: '#333' },
  round:      { fontSize: '13px', color: '#666' },
  score: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#f9f9f9',
    padding: '10px', borderRadius: '8px', marginTop: '5px',
  },
  teamBlock:  { textAlign: 'center', flex: 1 },
  teamName:   { fontSize: '12px', color: '#555', marginBottom: '4px' },
  goals:      { fontSize: '28px', fontWeight: 'bold', color: '#006400' },
  vs:         { fontSize: '14px', color: '#999', fontWeight: 'bold' },
  winner:     { textAlign: 'center', fontWeight: 'bold', fontSize: '14px' },
  details:    { fontSize: '13px', color: '#666', lineHeight: '1.8' },
  viewBtn: {
    textAlign: 'center', backgroundColor: '#006400', color: '#fff',
    padding: '8px', borderRadius: '5px', textDecoration: 'none',
    fontSize: '14px', marginTop: '5px',
  },
  error:      { color: 'red' },
  noData:     { textAlign: 'center', color: '#666', marginTop: '50px', fontSize: '18px' },
};

export default Matches;