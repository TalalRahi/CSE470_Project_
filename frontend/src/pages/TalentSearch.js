// Import useState
import { useState } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// TALENT SEARCH PAGE
// Requirement 3.4 - Talent Search & Filtering
// -----------------------------------------------
const TalentSearch = () => {
  // Filter values
  const [position, setPosition] = useState('');
  const [region, setRegion]     = useState('');
  const [minAge, setMinAge]     = useState('');
  const [maxAge, setMaxAge]     = useState('');
  const [minSkill, setMinSkill] = useState('');

  // Results
  const [players, setPlayers]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const { token } = useAuth();

  // -----------------------------------------------
  // HANDLE SEARCH
  // -----------------------------------------------
  const handleSearch = async () => {
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (position) params.append('position', position);
      if (region)   params.append('region',   region);
      if (minAge)   params.append('minAge',   minAge);
      if (maxAge)   params.append('maxAge',   maxAge);
      if (minSkill) params.append('minSkill', minSkill);

      const res = await axios.get(
        `http://localhost:5000/api/analytics/search?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPlayers(res.data.players);

    } catch (err) {
      setError('Search failed ❌');
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setPosition('');
    setRegion('');
    setMinAge('');
    setMaxAge('');
    setMinSkill('');
    setPlayers([]);
    setSearched(false);
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/analytics' style={styles.backBtn}>← Analytics</Link>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>🔍 Talent Search</h2>

        {/* Filter box */}
        <div style={styles.filterBox}>
          <h3 style={styles.filterTitle}>Search Filters</h3>

          <div style={styles.filterGrid}>

            {/* Position */}
            <div style={styles.filterField}>
              <label style={styles.label}>Position</label>
              <select style={styles.input}
                value={position}
                onChange={e => setPosition(e.target.value)}>
                <option value=''>All Positions</option>
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

            {/* Region */}
            <div style={styles.filterField}>
              <label style={styles.label}>Region / City</label>
              <input style={styles.input}
                placeholder='e.g. Dhaka'
                value={region}
                onChange={e => setRegion(e.target.value)} />
            </div>

            {/* Min Age */}
            <div style={styles.filterField}>
              <label style={styles.label}>Min Age</label>
              <input style={styles.input}
                type='number' placeholder='e.g. 14'
                value={minAge}
                onChange={e => setMinAge(e.target.value)} />
            </div>

            {/* Max Age */}
            <div style={styles.filterField}>
              <label style={styles.label}>Max Age</label>
              <input style={styles.input}
                type='number' placeholder='e.g. 21'
                value={maxAge}
                onChange={e => setMaxAge(e.target.value)} />
            </div>

            {/* Min Skill */}
            <div style={styles.filterField}>
              <label style={styles.label}>Min Avg Skill (1-100)</label>
              <input style={styles.input}
                type='number' placeholder='e.g. 60'
                min='1' max='100'
                value={minSkill}
                onChange={e => setMinSkill(e.target.value)} />
            </div>

          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.searchBtn} onClick={handleSearch}>
              🔍 Search
            </button>
            <button style={styles.resetBtn} onClick={handleReset}>
              🔄 Reset
            </button>
          </div>

        </div>

        {error   && <p style={styles.error}>{error}</p>}
        {loading && <p>Searching...</p>}

        {/* Results */}
        {searched && !loading && (
          <>
            <p style={styles.resultCount}>
              Found {players.length} player(s)
            </p>

            <div style={styles.grid}>
              {players.map(player => (
                <div key={player._id} style={styles.card}>
                  <h3 style={styles.playerName}>{player.name}</h3>
                  <span style={styles.posBadge}>{player.position}</span>
                  <div style={styles.details}>
                    <p>🎂 Age: {player.age}</p>
                    <p>📍 Region: {player.region}</p>
                    <p>🏟️ Club: {player.club}</p>
                    <p>📏 Height: {player.height} cm</p>
                  </div>
                  {player.skills?.pace && (
                    <div style={styles.skills}>
                      <p>⚡ Pace: {player.skills.pace}</p>
                      <p>🎯 Shooting: {player.skills.shooting}</p>
                      <p>🅿️ Passing: {player.skills.passing}</p>
                    </div>
                  )}
                </div>
              ))}

              {players.length === 0 && (
                <p style={styles.noData}>
                  No players found with these filters
                </p>
              )}
            </div>
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
  filterBox: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px',
  },
  filterTitle: { color: '#006400', marginBottom: '15px' },
  filterGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '15px', marginBottom: '20px',
  },
  filterField: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label:       { fontSize: '13px', fontWeight: 'bold', color: '#555' },
  input: {
    padding: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  btnRow:      { display: 'flex', gap: '10px' },
  searchBtn: {
    padding: '10px 25px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  resetBtn: {
    padding: '10px 25px', backgroundColor: '#ccc', color: '#333',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  resultCount: { color: '#666', marginBottom: '15px', fontSize: '14px' },
  grid:        { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  card: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '250px',
  },
  playerName:  { color: '#006400', fontSize: '18px', marginBottom: '5px' },
  posBadge: {
    backgroundColor: '#e8f5e9', color: '#006400',
    padding: '3px 10px', borderRadius: '10px',
    fontSize: '12px', display: 'inline-block', marginBottom: '10px',
  },
  details:     { fontSize: '13px', lineHeight: '1.8', marginBottom: '10px' },
  skills:      { fontSize: '13px', lineHeight: '1.8', color: '#555' },
  error:       { color: 'red' },
  noData:      { color: '#999', fontSize: '14px' },
};

export default TalentSearch;