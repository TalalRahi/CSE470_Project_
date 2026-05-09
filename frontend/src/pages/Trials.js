// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import Link for navigation
import { Link } from 'react-router-dom';

// -----------------------------------------------
// TRIALS PAGE
// Requirement 4.2 - Trial/Camp Application System
// -----------------------------------------------
const Trials = () => {
  const [trials, setTrials]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [msg, setMsg]         = useState('');

  const { token, user } = useAuth();

  // Fetch all trials
  const fetchTrials = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/trials',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTrials(res.data.trials);
    } catch (err) {
      setError('Failed to fetch trials ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrials(); }, [token]);

  // Apply for a trial
  const handleApply = async (trialId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/trials/${trialId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Applied successfully ✅');
      fetchTrials();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to apply ❌');
    }
  };

  // Check if player already applied
  const hasApplied = (trial) => {
    return trial.applications?.some(
      app => app.appliedBy === user?.id
    );
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <div style={styles.navRight}>
          {(user?.role === 'Coach' || user?.role === 'Admin') && (
            <Link to='/trials/create' style={styles.addBtn}>
              ➕ Create Trial
            </Link>
          )}
          <Link to='/dashboard' style={styles.backBtn}>← Dashboard</Link>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>🎯 Trials & Camps</h2>

        {msg     && <p style={styles.success}>{msg}</p>}
        {error   && <p style={styles.error}>{error}</p>}
        {loading && <p>Loading trials...</p>}

        <div style={styles.grid}>
          {trials.map(trial => (
            <div key={trial._id} style={styles.card}>

              <h3 style={styles.trialTitle}>{trial.title}</h3>
              <p style={styles.desc}>{trial.description}</p>

              <div style={styles.details}>
                <p>📍 {trial.location}</p>
                <p>📅 {new Date(trial.trialDate).toDateString()}</p>
                <p>👤 By: {trial.createdBy?.name}</p>
                <p>👥 Applications: {trial.applications?.length || 0}</p>
              </div>

              {/* Apply button for Players only */}
              {user?.role === 'Player' && (
                <button
                  style={styles.applyBtn}
                  onClick={() => handleApply(trial._id)}
                >
                  ✅ Apply Now
                </button>
              )}

              {/* Applications list for Coach/Admin */}
              {(user?.role === 'Coach' || user?.role === 'Admin') &&
                trial.applications?.length > 0 && (
                <div style={styles.applications}>
                  <p style={styles.appTitle}>Applications:</p>
                  {trial.applications.map(app => (
                    <div key={app._id} style={styles.appRow}>
                      <span style={{
                        ...styles.appStatus,
                        backgroundColor:
                          app.status === 'Accepted' ? '#006400' :
                          app.status === 'Rejected' ? '#cc0000' : '#FF8C00',
                      }}>
                        {app.status}
                      </span>
                      <div style={styles.appBtns}>
                        <button
                          style={styles.acceptBtn}
                          onClick={async () => {
                            await axios.put(
                              `http://localhost:5000/api/trials/${trial._id}/applications/${app._id}`,
                              { status: 'Accepted' },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            fetchTrials();
                          }}
                        >
                          ✅ Accept
                        </button>
                        <button
                          style={styles.rejectBtn}
                          onClick={async () => {
                            await axios.put(
                              `http://localhost:5000/api/trials/${trial._id}/applications/${app._id}`,
                              { status: 'Rejected' },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            fetchTrials();
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

        {!loading && trials.length === 0 && (
          <p style={styles.noData}>No trials available yet.</p>
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
  navRight:    { display: 'flex', gap: '15px', alignItems: 'center' },
  addBtn: {
    backgroundColor: '#fff', color: '#006400', padding: '8px 16px',
    borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px',
  },
  backBtn:     { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  content:     { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  title:       { fontSize: '28px', marginBottom: '20px' },
  grid:        { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  card: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '280px',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  trialTitle:  { color: '#006400', fontSize: '18px' },
  desc:        { fontSize: '13px', color: '#666', lineHeight: '1.5' },
  details:     { fontSize: '13px', lineHeight: '1.8', color: '#555' },
  applyBtn: {
    padding: '10px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  applications:{ borderTop: '1px solid #eee', paddingTop: '10px' },
  appTitle:    { fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' },
  appRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '8px',
  },
  appStatus: {
    fontSize: '11px', color: '#fff', padding: '3px 8px',
    borderRadius: '10px', fontWeight: 'bold',
  },
  appBtns:     { display: 'flex', gap: '5px' },
  acceptBtn: {
    padding: '4px 8px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px',
  },
  rejectBtn: {
    padding: '4px 8px', backgroundColor: '#cc0000', color: '#fff',
    border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px',
  },
  success:     { color: 'green', marginBottom: '10px' },
  error:       { color: 'red', marginBottom: '10px' },
  noData:      { color: '#999', textAlign: 'center', marginTop: '50px', fontSize: '18px' },
};

export default Trials;