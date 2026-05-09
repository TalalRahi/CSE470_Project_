// Import useState and useEffect
import { useState, useEffect } from 'react';

// Import axios to send requests to backend
import axios from 'axios';

// Import useAuth to get token
import { useAuth } from '../context/AuthContext';

// Import useParams to get player id from URL
import { useParams, Link } from 'react-router-dom';

// -----------------------------------------------
// PLAYER ACHIEVEMENTS PAGE
// Requirement 4.5 - Achievement & Certificate Showcase
// Requirement 4.1 - Highlight & Media Upload
// Requirement 4.3 - Player Visibility Settings
// -----------------------------------------------
const PlayerAchievements = () => {
  const [player, setPlayer]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [msg, setMsg]           = useState('');

  // Forms
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [showMediaForm, setShowMediaForm]             = useState(false);
  const [showVisibilityForm, setShowVisibilityForm]   = useState(false);

  const [achievement, setAchievement] = useState({ title: '', description: '', icon: '🏆' });
  const [media, setMedia]             = useState({ title: '', url: '', type: 'video' });
  const [visibility, setVisibility]   = useState('Public');

  const { playerId } = useParams();
  const { token }    = useAuth();

  // Fetch player
  const fetchPlayer = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/players/${playerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayer(res.data.player);
      setVisibility(res.data.player.visibility);
    } catch (err) {
      setError('Failed to fetch player ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlayer(); }, [playerId, token]);

  // Add achievement
  const handleAddAchievement = async () => {
    if (!achievement.title || !achievement.description) {
      setMsg('Please fill in all fields ❌');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/achievements/${playerId}`,
        achievement,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg('Achievement added ✅');
      setAchievement({ title: '', description: '', icon: '🏆' });
      setShowAchievementForm(false);
      fetchPlayer();

    } catch (err) {
      setMsg('Failed to add achievement ❌');
    }
  };

  // Add media
  const handleAddMedia = async () => {
    if (!media.title || !media.url) {
      setMsg('Please fill in all fields ❌');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/achievements/${playerId}/media`,
        media,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg('Media added ✅');
      setMedia({ title: '', url: '', type: 'video' });
      setShowMediaForm(false);
      fetchPlayer();

    } catch (err) {
      setMsg('Failed to add media ❌');
    }
  };

  // Update visibility
  const handleUpdateVisibility = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/achievements/${playerId}/visibility`,
        { visibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg('Visibility updated ✅');
      setShowVisibilityForm(false);
      fetchPlayer();

    } catch (err) {
      setMsg('Failed to update visibility ❌');
    }
  };

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
        {msg   && <p style={styles.success}>{msg}</p>}

        {player && (
          <>
            <h2 style={styles.title}>🎖️ {player.name}'s Achievements</h2>

            {/* Visibility Settings */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3>👁️ Visibility Settings</h3>
                <button
                  style={styles.addBtn}
                  onClick={() => setShowVisibilityForm(!showVisibilityForm)}
                >
                  {showVisibilityForm ? '❌' : '⚙️ Change'}
                </button>
              </div>

              <p style={styles.currentSetting}>
                Current: <strong>{player.visibility}</strong>
              </p>

              {showVisibilityForm && (
                <div style={styles.form}>
                  <select style={styles.input}
                    value={visibility}
                    onChange={e => setVisibility(e.target.value)}>
                    <option value='Public'>Public - Everyone can see</option>
                    <option value='Scouts Only'>Scouts Only - Only coaches/scouts can see</option>
                    <option value='Private'>Private - Hidden from everyone</option>
                  </select>

                  <button style={styles.saveBtn} onClick={handleUpdateVisibility}>
                    💾 Save Visibility
                  </button>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3>🏆 Achievements & Certificates</h3>
                <button
                  style={styles.addBtn}
                  onClick={() => setShowAchievementForm(!showAchievementForm)}
                >
                  {showAchievementForm ? '❌' : '➕ Add'}
                </button>
              </div>

              {showAchievementForm && (
                <div style={styles.form}>
                  <input style={styles.input} placeholder='Title *'
                    value={achievement.title}
                    onChange={e => setAchievement({...achievement, title: e.target.value})} />

                  <textarea style={styles.textarea} placeholder='Description *'
                    value={achievement.description}
                    onChange={e => setAchievement({...achievement, description: e.target.value})} />

                  <input style={styles.input} placeholder='Icon/Emoji'
                    value={achievement.icon}
                    onChange={e => setAchievement({...achievement, icon: e.target.value})} />

                  <button style={styles.saveBtn} onClick={handleAddAchievement}>
                    💾 Add Achievement
                  </button>
                </div>
              )}

              <div style={styles.list}>
                {player.achievements && player.achievements.length > 0 ? (
                  player.achievements.map((ach, idx) => (
                    <div key={idx} style={styles.item}>
                      <span style={styles.icon}>{ach.icon}</span>
                      <div style={styles.itemContent}>
                        <p style={styles.itemTitle}>{ach.title}</p>
                        <p style={styles.itemDesc}>{ach.description}</p>
                        <p style={styles.itemDate}>
                          Earned: {new Date(ach.earnedDate).toDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={styles.noData}>No achievements yet</p>
                )}
              </div>
            </div>

            {/* Media/Highlights */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3>📹 Highlights & Media</h3>
                <button
                  style={styles.addBtn}
                  onClick={() => setShowMediaForm(!showMediaForm)}
                >
                  {showMediaForm ? '❌' : '➕ Add'}
                </button>
              </div>

              {showMediaForm && (
                <div style={styles.form}>
                  <input style={styles.input} placeholder='Title *'
                    value={media.title}
                    onChange={e => setMedia({...media, title: e.target.value})} />

                  <input style={styles.input} placeholder='URL (YouTube, Vimeo, image link) *'
                    value={media.url}
                    onChange={e => setMedia({...media, url: e.target.value})} />

                  <select style={styles.input}
                    value={media.type}
                    onChange={e => setMedia({...media, type: e.target.value})}>
                    <option value='video'>Video</option>
                    <option value='image'>Image</option>
                  </select>

                  <button style={styles.saveBtn} onClick={handleAddMedia}>
                    💾 Add Media
                  </button>
                </div>
              )}

              <div style={styles.list}>
                {player.mediaHighlights && player.mediaHighlights.length > 0 ? (
                  player.mediaHighlights.map((med, idx) => (
                    <div key={idx} style={styles.mediaItem}>
                      <div style={styles.mediaType}>
                        {med.type === 'video' ? '📹' : '📸'}
                      </div>
                      <div style={styles.mediaContent}>
                        <p style={styles.itemTitle}>{med.title}</p>
                        <p style={styles.itemTitle}>{med.title}</p>
                        <p style={styles.mediaUrl}>{med.url}</p>
                        <p style={styles.itemDate}>
                          Uploaded: {new Date(med.uploadedAt).toDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={styles.noData}>No media uploads yet</p>
                )}
              </div>
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
  content:     { padding: '40px', maxWidth: '800px', margin: '0 auto' },
  title:       { fontSize: '28px', marginBottom: '30px' },
  section: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '15px',
  },
  addBtn: {
    padding: '8px 15px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px',
  },
  currentSetting: { color: '#666', marginBottom: '15px' },
  form: {
    display: 'flex', flexDirection: 'column', gap: '12px',
    backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px',
    marginBottom: '15px',
  },
  input: {
    padding: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
  },
  textarea: {
    padding: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px',
    minHeight: '80px', resize: 'vertical',
  },
  saveBtn: {
    padding: '10px', backgroundColor: '#006400', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
  },
  list: {
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  item: {
    display: 'flex', gap: '15px', padding: '15px',
    backgroundColor: '#f9f9f9', borderRadius: '8px',
  },
  icon:        { fontSize: '32px', minWidth: '40px', textAlign: 'center' },
  itemContent: { flex: 1 },
  itemTitle:   { fontWeight: 'bold', fontSize: '14px', margin: '0 0 5px' },
  itemDesc:    { fontSize: '13px', color: '#555', margin: '0 0 5px' },
  itemDate:    { fontSize: '12px', color: '#999', margin: '0' },
  mediaItem: {
    display: 'flex', gap: '15px', padding: '15px',
    backgroundColor: '#f9f9f9', borderRadius: '8px',
  },
  mediaType:   { fontSize: '28px', minWidth: '50px', textAlign: 'center' },
  mediaContent:{ flex: 1 },
  mediaUrl:    { fontSize: '12px', color: '#0047AB', wordBreak: 'break-all', margin: '5px 0' },
  noData:      { color: '#999', fontSize: '14px', textAlign: 'center', padding: '15px' },
  error:       { color: 'red', marginBottom: '10px' },
  success:     { color: 'green', marginBottom: '10px' },
};

export default PlayerAchievements;