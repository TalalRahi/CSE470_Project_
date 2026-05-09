import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';

const MatchDetail = () => {
  const [match, setMatch]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Result update form
  const [homeGoals, setHomeGoals] = useState('');
  const [awayGoals, setAwayGoals] = useState('');
  const [resultMsg, setResultMsg] = useState('');

  const { token, user } = useAuth();
  const { id }          = useParams();

  const fetchMatch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/matches/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatch(res.data.match);
    } catch (err) {
      setError('Failed to load match ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatch(); }, [id, token]);

  // Update match result
  const handleUpdateResult = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/matches/${id}/result`,
        {
          homeGoals: Number(homeGoals),
          awayGoals: Number(awayGoals),
          status: 'Completed',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResultMsg('Result updated ✅');
      fetchMatch(); // Refresh match data
    } catch (err) {
      setResultMsg('Failed to update result ❌');
    }
  };

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>;
  if (error)   return <p style={{ padding: '40px', color: 'red' }}>{error}</p>;
  if (!match)  return null;

  const canEdit = user?.role === 'Coach' || user?.role === 'Admin';

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
          <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
          <div style={styles.navRight}>
            {/* Coach and Admin can enter match stats */}
            {(user?.role === 'Coach' || user?.role === 'Admin') && (
              <Link to={`/matches/${match._id}/stats`} style={styles.statsBtn}>
                📊 Enter Stats
              </Link>
            )}
            <Link to='/matches' style={styles.backBtn}>← Back</Link>
          </div>
        </div>

      <div style={styles.content}>

        {/* Match Header */}
        <div style={styles.header}>
          <span style={styles.matchType}>{match.matchType}</span>
          <h2 style={styles.compName}>{match.competitionName}</h2>
          {match.round && <p style={styles.round}>{match.round}</p>}
          <p style={styles.meta}>
            📅 {new Date(match.matchDate).toDateString()} &nbsp;|&nbsp;
            📍 {match.venue}
          </p>
          <span style={{
            ...styles.statusBadge,
            backgroundColor:
              match.status === 'Completed' ? '#006400' :
              match.status === 'Ongoing'   ? '#FF8C00' : '#999'
          }}>
            {match.status}
          </span>
        </div>

        {/* Scoreboard */}
        <div style={styles.scoreboard}>
          <div style={styles.teamSide}>
            <p style={styles.teamName}>{match.homeTeam.name}</p>
            <p style={styles.formation}>Formation: {match.homeTeam.formation}</p>
            <p style={styles.bigScore}>{match.homeTeam.goalsScored}</p>
          </div>
          <div style={styles.middle}>
            <p style={styles.vs}>VS</p>
            {match.winner && (
              <p style={styles.winner}>
                {match.winner === 'Draw' ? '🤝 Draw' :
                  `🏆 ${match.winner === 'Home'
                    ? match.homeTeam.name
                    : match.awayTeam.name} Won`}
              </p>
            )}
          </div>
          <div style={styles.teamSide}>
            <p style={styles.teamName}>{match.awayTeam.name}</p>
            <p style={styles.formation}>Formation: {match.awayTeam.formation}</p>
            <p style={styles.bigScore}>{match.awayTeam.goalsScored}</p>
          </div>
        </div>

        {/* Update Result (Coach/Admin only) */}
        {canEdit && match.status !== 'Completed' && (
          <div style={styles.resultBox}>
            <h3 style={styles.sectionTitle}>📝 Update Result</h3>
            <div style={styles.resultRow}>
              <div style={styles.resultField}>
                <label>{match.homeTeam.name} Goals</label>
                <input style={styles.smallInput} type='number'
                  value={homeGoals}
                  onChange={e => setHomeGoals(e.target.value)} />
              </div>
              <div style={styles.resultField}>
                <label>{match.awayTeam.name} Goals</label>
                <input style={styles.smallInput} type='number'
                  value={awayGoals}
                  onChange={e => setAwayGoals(e.target.value)} />
              </div>
              <button style={styles.updateBtn} onClick={handleUpdateResult}>
                Update Result
              </button>
            </div>
            {resultMsg && <p style={{ color: 'green', marginTop: '8px' }}>{resultMsg}</p>}
          </div>
        )}

        {/* Squads */}
        <div style={styles.squadsRow}>

          {/* Home Squad */}
          <div style={styles.squadBox}>
            <h3 style={styles.sectionTitle}>
              🏠 {match.homeTeam.name} Squad
            </h3>
            {match.homeTeam.squad.length === 0
              ? <p style={styles.noData}>No squad registered</p>
              : match.homeTeam.squad.map(s => (
                <div key={s._id} style={styles.playerRow}>
                  <span style={styles.playerName}>
                    {s.player?.name || 'Unknown'}
                  </span>
                  <span style={styles.playerPos}>
                    {s.player?.position}
                  </span>
                  <div style={styles.statRow}>
                    <span>⏱ {s.minutesPlayed}min</span>
                    <span>⚽ {s.goals}</span>
                    <span>🅰️ {s.assists}</span>
                    <span>🟨 {s.yellowCards}</span>
                    <span>🟥 {s.redCards}</span>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Away Squad */}
          <div style={styles.squadBox}>
            <h3 style={styles.sectionTitle}>
              ✈️ {match.awayTeam.name} Squad
            </h3>
            {match.awayTeam.squad.length === 0
              ? <p style={styles.noData}>No squad registered</p>
              : match.awayTeam.squad.map(s => (
                <div key={s._id} style={styles.playerRow}>
                  <span style={styles.playerName}>
                    {s.player?.name || 'Unknown'}
                  </span>
                  <span style={styles.playerPos}>
                    {s.player?.position}
                  </span>
                  <div style={styles.statRow}>
                    <span>⏱ {s.minutesPlayed}min</span>
                    <span>⚽ {s.goals}</span>
                    <span>🅰️ {s.assists}</span>
                    <span>🟨 {s.yellowCards}</span>
                    <span>🟥 {s.redCards}</span>
                  </div>
                </div>
              ))
            }
          </div>

        </div>

        {/* Notes */}
        {match.notes && (
          <div style={styles.notesBox}>
            <h3 style={styles.sectionTitle}>📋 Notes</h3>
            <p>{match.notes}</p>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container:    { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#006400', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  navRight:    { display: 'flex', gap: '15px', alignItems: 'center' },
  statsBtn: {
    backgroundColor: '#fff', color: '#006400', padding: '8px 16px',
    borderRadius: '5px', textDecoration: 'none',
    fontWeight: 'bold', fontSize: '14px',
  },
  navTitle:     { color: '#fff', fontSize: '20px' },
  backBtn:      { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  content:      { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  header: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px',
    textAlign: 'center',
  },
  matchType:    { fontSize: '12px', color: '#006400', fontWeight: 'bold' },
  compName:     { fontSize: '22px', margin: '8px 0' },
  round:        { color: '#666', fontSize: '14px' },
  meta:         { color: '#666', fontSize: '14px', margin: '8px 0' },
  statusBadge: {
    display: 'inline-block', fontSize: '12px', color: '#fff',
    padding: '4px 12px', borderRadius: '10px', fontWeight: 'bold',
  },
  scoreboard: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  teamSide:     { textAlign: 'center', flex: 1 },
  teamName:     { fontSize: '16px', fontWeight: 'bold', color: '#333' },
  formation:    { fontSize: '12px', color: '#999', margin: '4px 0' },
  bigScore:     { fontSize: '48px', fontWeight: 'bold', color: '#006400' },
  middle:       { textAlign: 'center', padding: '0 20px' },
  vs:           { fontSize: '20px', color: '#999', fontWeight: 'bold' },
  winner:       { fontSize: '14px', fontWeight: 'bold', color: '#006400', marginTop: '8px' },
  resultBox: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px',
  },
  sectionTitle: { color: '#006400', marginBottom: '12px' },
  resultRow:    { display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' },
  resultField:  { display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '14px' },
  smallInput: {
    padding: '8px', borderRadius: '5px', border: '1px solid #ddd',
    width: '80px', textAlign: 'center', fontSize: '16px',
  },
  updateBtn: {
    padding: '10px 20px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  squadsRow: {
    display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px',
  },
  squadBox: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', flex: 1, minWidth: '280px',
  },
  playerRow: {
    borderBottom: '1px solid #f0f0f0', paddingBottom: '10px',
    marginBottom: '10px',
  },
  playerName:   { fontWeight: 'bold', fontSize: '14px', display: 'block' },
  playerPos: {
    fontSize: '12px', color: '#006400', backgroundColor: '#e8f5e9',
    padding: '2px 8px', borderRadius: '10px', display: 'inline-block', margin: '4px 0',
  },
  statRow:      { display: 'flex', gap: '10px', fontSize: '12px', color: '#666', flexWrap: 'wrap' },
  notesBox: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  noData:       { color: '#999', fontSize: '14px' },
};

export default MatchDetail;