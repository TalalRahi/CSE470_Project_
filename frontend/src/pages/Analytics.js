// Import Link for navigation
import { Link } from 'react-router-dom';

// Import useAuth to get user info
import { useAuth } from '../context/AuthContext';

// -----------------------------------------------
// ANALYTICS PAGE
// Main hub for all analytics features
// Requirement 3 - Football Analytics
// -----------------------------------------------
const Analytics = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <Link to='/dashboard' style={styles.backBtn}>← Dashboard</Link>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.title}>📊 Football Analytics</h2>
        <p style={styles.subtitle}>
          Discover talent, analyze performance and track top performers
        </p>

        <div style={styles.cards}>

          {/* 3.1 Rankings */}
          <Link to='/rankings' style={styles.card}>
            <div style={styles.icon}>🏅</div>
            <h3 style={styles.cardTitle}>Player Rankings</h3>
            <p style={styles.cardDesc}>
              View players ranked by their overall skill rating
            </p>
          </Link>

          {/* 3.3 Compare */}
          <Link to='/compare' style={styles.card}>
            <div style={styles.icon}>⚖️</div>
            <h3 style={styles.cardTitle}>Compare Players</h3>
            <p style={styles.cardDesc}>
              Compare two players side by side
            </p>
          </Link>

          {/* 3.4 Talent Search */}
          <Link to='/talent-search' style={styles.card}>
            <div style={styles.icon}>🔍</div>
            <h3 style={styles.cardTitle}>Talent Search</h3>
            <p style={styles.cardDesc}>
              Search and filter players by position, region, age and skills
            </p>
          </Link>

          {/* 3.5 Leaderboards */}
          <Link to='/leaderboards' style={styles.card}>
            <div style={styles.icon}>🏆</div>
            <h3 style={styles.cardTitle}>Leaderboards</h3>
            <p style={styles.cardDesc}>
              Top scorers, assist leaders and best rated players
            </p>
          </Link>

        </div>
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
  backBtn:    { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  content:    { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  title:      { fontSize: '28px', marginBottom: '10px' },
  subtitle:   { color: '#666', fontSize: '16px', marginBottom: '30px' },
  cards:      { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  card: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '200px',
    textDecoration: 'none', color: '#333', textAlign: 'center',
    transition: 'transform 0.2s',
  },
  icon:       { fontSize: '40px', marginBottom: '10px' },
  cardTitle:  { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#006400' },
  cardDesc:   { fontSize: '13px', color: '#666', lineHeight: '1.5' },
};

export default Analytics;