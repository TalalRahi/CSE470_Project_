// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// SCOUT REQUESTS PAGE
// Requirement 4.4 - Scout Request & Contact
// Players see requests received
// Coaches see requests they sent
// -----------------------------------------------
const ScoutRequests = () => {
  const [requests, setRequests] = useState([]);
  const [players, setPlayers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [msg, setMsg]           = useState('');

  // Send scout request form
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [message, setMessage]               = useState('');
  const [contactEmail, setContactEmail]     = useState('');
  const [contactPhone, setContactPhone]     = useState('');

  const { token, user } = useAuth();

  // Fetch requests based on role
  const fetchRequests = async () => {
    try {
      // Players see requests sent TO them
      // Coaches see requests they sent
      const url = user?.role === 'Player'
        ? 'http://localhost:5000/api/scouts/myrequests'
        : 'http://localhost:5000/api/scouts/sent';

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(res.data.requests);
    } catch (err) {
      setError('Failed to fetch scout requests ❌');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all players (for coach to select)
  const fetchPlayers = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/players',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayers(res.data.players);
    } catch (err) {
      console.error('Failed to fetch players');
    }
  };

  useEffect(() => {
    fetchRequests();
    if (user?.role === 'Coach') fetchPlayers();
  }, [token]);

  // Send scout request (Coach only)
  const handleSendRequest = async () => {
    if (!selectedPlayer || !message || !contactEmail) {
      setMsg('Please fill in all fields ❌');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/scouts',
        {
          playerId:     selectedPlayer,
          message,
          contactEmail,
          contactPhone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg('Scout request sent successfully ✅');
      setSelectedPlayer('');
      setMessage('');
      setContactEmail('');
      setContactPhone('');
      fetchRequests();

    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to send request ❌');
    }
  };

  // Update scout request status (Player only)
  const handleUpdateStatus = async (requestId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/scouts/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(`Request ${status} ✅`);
      fetchRequests();
    } catch (err) {
      setMsg('Failed to update status ❌');
    }
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/dashboard' style={styles.backBtn}>← Dashboard</Link>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>🔭 Scout Requests</h2>

        {msg   && <p style={styles.success}>{msg}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Coach — Send Scout Request Form */}
        {user?.role === 'Coach' && (
          <div style={styles.formBox}>
            <h3 style={styles.formTitle}>📤 Send Scout Request</h3>

            <select style={styles.input}
              value={selectedPlayer}
              onChange={e => setSelectedPlayer(e.target.value)}>
              <option value=''>Select Player *</option>
              {players.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.position})
                </option>
              ))}
            </select>

            <textarea style={styles.textarea}
              placeholder='Message to player *'
              value={message}
              onChange={e => setMessage(e.target.value)} />

            <input style={styles.input}
              placeholder='Contact Email *'
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)} />

            <input style={styles.input}
              placeholder='Contact Phone (optional)'
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)} />

            <button style={styles.sendBtn} onClick={handleSendRequest}>
              📤 Send Request
            </button>
          </div>
        )}

        {/* Requests list */}
        <h3 style={styles.listTitle}>
          {user?.role === 'Player' ? '📥 Requests Received' : '📤 Requests Sent'}
        </h3>

        {loading && <p>Loading...</p>}

        <div style={styles.grid}>
          {requests.map(req => (
            <div key={req._id} style={styles.card}>

              {/* Status badge */}
              <span style={{
                ...styles.statusBadge,
                backgroundColor:
                  req.status === 'Accepted' ? '#006400' :
                  req.status === 'Rejected' ? '#cc0000' : '#FF8C00',
              }}>
                {req.status}
              </span>

              {/* Player or Coach info */}
              {user?.role === 'Player' ? (
                <div style={styles.fromInfo}>
                  <p style={styles.fromName}>
                    From: {req.scoutedBy?.name}
                  </p>
                  <p style={styles.fromRole}>{req.scoutedBy?.role}</p>
                </div>
              ) : (
                <div style={styles.fromInfo}>
                  <p style={styles.fromName}>
                    To: {req.player?.name}
                  </p>
                  <p style={styles.fromRole}>{req.player?.position}</p>
                </div>
              )}

              {/* Message */}
              <p style={styles.message}>{req.message}</p>

              {/* Contact info */}
              <div style={styles.contact}>
                <p>📧 {req.contactEmail}</p>
                {req.contactPhone && <p>📱 {req.contactPhone}</p>}
              </div>

              {/* Accept/Reject buttons for Player */}
              {user?.role === 'Player' && req.status === 'Pending' && (
                <div style={styles.btnRow}>
                  <button
                    style={styles.acceptBtn}
                    onClick={() => handleUpdateStatus(req._id, 'Accepted')}
                  >
                    ✅ Accept
                  </button>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>

        {!loading && requests.length === 0 && (
          <p style={styles.noData}>No scout requests yet.</p>
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
  formBox: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  formTitle:   { color: '#006400', marginBottom: '5px' },
  input: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  textarea: {
    padding: '12px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
    minHeight: '80px', resize: 'vertical',
  },
  sendBtn: {
    padding: '12px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  listTitle:   { fontSize: '20px', marginBottom: '15px' },
  grid:        { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  card: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '280px',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  statusBadge: {
    display: 'inline-block', fontSize: '11px', color: '#fff',
    padding: '3px 10px', borderRadius: '10px', fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  fromInfo:    {},
  fromName:    { fontWeight: 'bold', fontSize: '16px', color: '#333' },
  fromRole:    { fontSize: '12px', color: '#999' },
  message:     { fontSize: '13px', color: '#555', lineHeight: '1.5' },
  contact:     { fontSize: '13px', color: '#666', lineHeight: '1.8' },
  btnRow:      { display: 'flex', gap: '10px' },
  acceptBtn: {
    flex: 1, padding: '8px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px',
  },
  rejectBtn: {
    flex: 1, padding: '8px', backgroundColor: '#cc0000', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px',
  },
  success:     { color: 'green', marginBottom: '10px' },
  error:       { color: 'red', marginBottom: '10px' },
  noData:      { color: '#999', textAlign: 'center', marginTop: '30px', fontSize: '16px' },
};

export default ScoutRequests;