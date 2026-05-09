// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import useParams to get match id from URL
import { useParams, Link } from 'react-router-dom';

// -----------------------------------------------
// ENTER MATCH STATS PAGE
// Requirement 2.4 - Enter Player Match Stats
// Coach/Admin can enter stats for each player
// -----------------------------------------------
const EnterMatchStats = () => {
  const [match, setMatch]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [msg, setMsg]       = useState('');

  // Track which player is being edited
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [stats, setStats]   = useState({
    minutesPlayed: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    rating: 5,
  });

  const { matchId } = useParams();
  const { token }   = useAuth();

  // Fetch match details
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/matches/${matchId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMatch(res.data.match);
      } catch (err) {
        setError('Failed to fetch match ❌');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId, token]);

  // Handle editing a player's stats
  const handleEditPlayer = (player, team) => {
    setEditingPlayer({ playerId: player._id, team });
    setStats({
      minutesPlayed: player.minutesPlayed || 0,
      goals: player.goals || 0,
      assists: player.assists || 0,
      yellowCards: player.yellowCards || 0,
      redCards: player.redCards || 0,
      rating: player.rating || 5,
    });
  };

  // Save player stats
  const handleSaveStats = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/matches/${matchId}/stats`,
        {
          team: editingPlayer.team,
          playerId: editingPlayer.playerId,
          stats,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg('Stats saved successfully ✅');
      setEditingPlayer(null);

      // Refetch match
      const res = await axios.get(
        `http://localhost:5000/api/matches/${matchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatch(res.data.match);

    } catch (err) {
      setMsg('Failed to save stats ❌');
    }
  };

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>;

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/matches' style={styles.backBtn}>← Back to Matches</Link>
      </div>

      <div style={styles.content}>

        {error && <p style={styles.error}>{error}</p>}
        {msg   && <p style={styles.success}>{msg}</p>}

        {match && (
          <>
            <h2 style={styles.title}>📊 Enter Match Stats</h2>

            <div style={styles.matchHeader}>
              <h3>{match.homeTeam.name} vs {match.awayTeam.name}</h3>
              <p>{new Date(match.matchDate).toDateString()}</p>
            </div>

            {/* Home Team */}
            <div style={styles.teamSection}>
              <h3 style={styles.teamTitle}>🏠 {match.homeTeam.name} Squad</h3>

              {match.homeTeam.squad.length === 0 ? (
                <p style={styles.noSquad}>No squad registered</p>
              ) : (
                <div style={styles.squadList}>
                  {match.homeTeam.squad.map((player, idx) => (
                    <div key={idx} style={styles.playerRow}>
                      <div style={styles.playerInfo}>
                        <p style={styles.playerName}>
                          {player.player?.name || 'Unknown'}
                        </p>
                        <p style={styles.playerPos}>
                          {player.player?.position}
                        </p>
                      </div>

                      <div style={styles.playerStats}>
                        <span>⏱ {player.minutesPlayed}m</span>
                        <span>⚽ {player.goals}g</span>
                        <span>🅰️ {player.assists}a</span>
                      </div>

                      <button
                        style={styles.editBtn}
                        onClick={() => handleEditPlayer(player, 'home')}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div style={styles.teamSection}>
              <h3 style={styles.teamTitle}>✈️ {match.awayTeam.name} Squad</h3>

              {match.awayTeam.squad.length === 0 ? (
                <p style={styles.noSquad}>No squad registered</p>
              ) : (
                <div style={styles.squadList}>
                  {match.awayTeam.squad.map((player, idx) => (
                    <div key={idx} style={styles.playerRow}>
                      <div style={styles.playerInfo}>
                        <p style={styles.playerName}>
                          {player.player?.name || 'Unknown'}
                        </p>
                        <p style={styles.playerPos}>
                          {player.player?.position}
                        </p>
                      </div>

                      <div style={styles.playerStats}>
                        <span>⏱ {player.minutesPlayed}m</span>
                        <span>⚽ {player.goals}g</span>
                        <span>🅰️ {player.assists}a</span>
                      </div>

                      <button
                        style={styles.editBtn}
                        onClick={() => handleEditPlayer(player, 'away')}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit form modal */}
            {editingPlayer && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3 style={styles.modalTitle}>📊 Enter Stats</h3>

                  <div style={styles.formGrid}>
                    <div>
                      <label style={styles.label}>Minutes Played</label>
                      <input style={styles.input} type='number'
                        value={stats.minutesPlayed}
                        onChange={e => setStats({...stats, minutesPlayed: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label style={styles.label}>Goals</label>
                      <input style={styles.input} type='number'
                        value={stats.goals}
                        onChange={e => setStats({...stats, goals: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label style={styles.label}>Assists</label>
                      <input style={styles.input} type='number'
                        value={stats.assists}
                        onChange={e => setStats({...stats, assists: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label style={styles.label}>Yellow Cards</label>
                      <input style={styles.input} type='number'
                        value={stats.yellowCards}
                        onChange={e => setStats({...stats, yellowCards: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label style={styles.label}>Red Cards</label>
                      <input style={styles.input} type='number'
                        value={stats.redCards}
                        onChange={e => setStats({...stats, redCards: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label style={styles.label}>Rating (1-10)</label>
                      <input style={styles.input} type='number' min='1' max='10'
                        value={stats.rating}
                        onChange={e => setStats({...stats, rating: parseInt(e.target.value)})} />
                    </div>
                  </div>

                  <div style={styles.btnRow}>
                    <button style={styles.saveBtn} onClick={handleSaveStats}>
                      💾 Save Stats
                    </button>
                    <button style={styles.cancelBtn} onClick={() => setEditingPlayer(null)}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
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
  content:     { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  title:       { fontSize: '28px', marginBottom: '20px' },
  matchHeader: { textAlign: 'center', marginBottom: '30px', color: '#555' },
  teamSection: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px',
  },
  teamTitle:   { color: '#006400', marginBottom: '15px' },
  squadList:   { display: 'flex', flexDirection: 'column', gap: '10px' },
  playerRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px',
  },
  playerInfo:  { flex: 1 },
  playerName:  { fontWeight: 'bold', fontSize: '14px', margin: '0 0 3px' },
  playerPos:   { fontSize: '12px', color: '#999', margin: '0' },
  playerStats: { display: 'flex', gap: '10px', fontSize: '13px', color: '#555' },
  editBtn: {
    padding: '6px 12px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px',
  },
  noSquad:     { color: '#999', fontSize: '14px' },
  modal: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
    width: '90%', maxWidth: '500px',
  },
  modalTitle:  { color: '#006400', marginBottom: '20px' },
  formGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '15px', marginBottom: '20px',
  },
  label:       { fontSize: '13px', fontWeight: 'bold', color: '#555' },
  input: {
    padding: '8px', borderRadius: '5px', border: '1px solid #ddd',
    fontSize: '14px', width: '100%',
  },
  btnRow:      { display: 'flex', gap: '10px' },
  saveBtn: {
    flex: 1, padding: '10px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  cancelBtn: {
    flex: 1, padding: '10px', backgroundColor: '#ccc', color: '#333',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  error:       { color: 'red' },
  success:     { color: 'green' },
};

export default EnterMatchStats;