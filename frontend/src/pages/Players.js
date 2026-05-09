// Import useState and useEffect to fetch players
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link to navigate
import { Link } from 'react-router-dom';

// -----------------------------------------------
// PLAYERS PAGE
// -----------------------------------------------
const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const { token, user }       = useAuth();

  // -----------------------------------------------
  // FETCH PLAYERS
  // -----------------------------------------------
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:5000/api/players',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayers(res.data.players);
    } catch (err) {
      setError('Failed to fetch players ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [token]);

  // -----------------------------------------------
  // HANDLE DELETE
  // -----------------------------------------------
  const handleDelete = async (playerId) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this player? ❌'
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/players/${playerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove deleted player from list immediately
      setPlayers(players.filter(p => p._id !== playerId));
      alert('Player deleted successfully ✅');

    } catch (err) {
      alert('Failed to delete player ❌');
    }
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <div style={styles.navRight}>
          {user?.role === 'Player' && (
            <Link to='/add-player' style={styles.addBtn}>
              ➕ Create My Profile
            </Link>
          )}
          {user?.role === 'Admin' && (
            <Link to='/add-player' style={styles.addBtn}>
              ➕ Add Player
            </Link>
          )}
          <Link to='/dashboard' style={styles.backBtn}>
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.title}>👥 All Players</h2>

        {loading && <p>Loading players...</p>}
        {error   && <p style={styles.error}>{error}</p>}

        {!loading && (
          <p style={styles.count}>Total Players: {players.length}</p>
        )}

        {/* Players list */}
        <div style={styles.grid}>
          {players.map(player => (
            <div key={player._id} style={styles.card}>

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
              </div>

              <div style={styles.skills}>
                <p style={styles.skillTitle}>Skills:</p>
                {player.skills?.pace ? (
                  <>
                    <p>⚡ Pace: {player.skills?.pace}</p>
                    <p>🎯 Shooting: {player.skills?.shooting}</p>
                    <p>🅿️ Passing: {player.skills?.passing}</p>
                    <p>🏃 Dribbling: {player.skills?.dribbling}</p>
                    <p>🛡️ Tackling: {player.skills?.tackling}</p>
                    <p>💪 Stamina: {player.skills?.stamina}</p>
                  </>
                ) : (
                  <p style={styles.noSkills}>No skills rated yet</p>
                )}
              </div>

              <p style={styles.addedBy}>
                Added by: {player.addedBy?.name} ({player.addedBy?.role})
              </p>

              {(user?.role === 'Coach' || user?.role === 'Admin') && (
                <Link
                  to={`/edit-skills/${player._id}`}
                  style={styles.editSkillsBtn}
                >
                  ⚽ Edit Skills
                </Link>
              )}

              {(user?.role === 'Coach' || user?.role === 'Admin') && (
                <Link
                  to={`/add-performance/${player._id}`}
                  style={styles.perfBtn}
                >
                  📊 Add Performance
                </Link>
              )}

              <Link
                to={`/achievements/${player._id}`}
                style={styles.achievementsBtn}
              >
                🎖️ Achievements
              </Link>

              <Link
                to={`/trends/${player._id}`}
                style={styles.trendsBtn}
              >
                📈 Trends
              </Link>

              {user?.role === 'Admin' && (
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(player._id)}
                >
                  🗑️ Delete Player
                </button>
              )}

            </div>
          ))}
        </div>

        {!loading && players.length === 0 && (
          <p style={styles.noPlayers}>No players found. ⚽</p>
        )}

      </div>
    </div>
  );
};

// -----------------------------------------------
// STYLES
// -----------------------------------------------
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#006400', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  navTitle:  { color: '#fff', fontSize: '20px' },
  navRight:  { display: 'flex', gap: '15px', alignItems: 'center' },
  addBtn: {
    backgroundColor: '#fff', color: '#006400', padding: '8px 16px',
    borderRadius: '5px', textDecoration: 'none',
    fontWeight: 'bold', fontSize: '14px',
  },
  backBtn:   { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  content:   { padding: '40px' },
  title:     { fontSize: '24px', marginBottom: '10px' },
  count:     { color: '#666', marginBottom: '20px' },
  grid:      { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  card: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '280px',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  playerName: { color: '#006400', fontSize: '18px', marginBottom: '5px' },
  position:   { color: '#666', fontSize: '14px', marginBottom: '10px' },
  details: {
    fontSize: '14px', lineHeight: '1.8',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px', marginBottom: '10px',
  },
  skills: {
    fontSize: '14px', lineHeight: '1.8',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px', marginBottom: '10px',
  },
  skillTitle: { fontWeight: 'bold', marginBottom: '5px' },
  noSkills:   { color: '#999', fontStyle: 'italic' },
  addedBy:    { fontSize: '12px', color: '#999' },
  editSkillsBtn: {
    display: 'block', textAlign: 'center', marginTop: '5px',
    padding: '8px', backgroundColor: '#006400', color: '#fff',
    borderRadius: '5px', textDecoration: 'none', fontSize: '13px',
  },
  perfBtn: {
    display: 'block', textAlign: 'center', marginTop: '5px',
    padding: '8px', backgroundColor: '#0047AB', color: '#fff',
    borderRadius: '5px', textDecoration: 'none', fontSize: '13px',
  },
  achievementsBtn: {
    display: 'block', textAlign: 'center', marginTop: '5px',
    padding: '8px', backgroundColor: '#FF8C00', color: '#fff',
    borderRadius: '5px', textDecoration: 'none', fontSize: '13px',
  },
  trendsBtn: {
    display: 'block', textAlign: 'center', marginTop: '5px',
    padding: '8px', backgroundColor: '#8B008B', color: '#fff',
    borderRadius: '5px', textDecoration: 'none', fontSize: '13px',
  },
  deleteBtn: {
    display: 'block', width: '100%', textAlign: 'center',
    marginTop: '5px', padding: '8px', backgroundColor: '#cc0000',
    color: '#fff', borderRadius: '5px', border: 'none',
    fontSize: '13px', cursor: 'pointer',
  },
  error:     { color: 'red' },
  noPlayers: {
    textAlign: 'center', color: '#666',
    marginTop: '50px', fontSize: '18px',
  },
};

export default Players;