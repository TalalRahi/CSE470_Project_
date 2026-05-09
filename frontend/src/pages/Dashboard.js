import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>⚽ Bangladesh Football</h1>
        <div style={styles.navRight}>
          <span style={styles.userInfo}>{user?.name} ({user?.role})</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <h2 style={styles.welcome}>Welcome, {user?.name}! 👋</h2>
        <p style={styles.roleText}>
          Logged in as: <strong>{user?.role}</strong>
        </p>

        {/* ---- ALL ROLES ---- */}
        <h3 style={styles.sectionTitle}>📋 General</h3>
        <div style={styles.cards}>

          <Link to='/players' style={styles.card}>
            <h3>👥 Players</h3>
            <p>View all player profiles</p>
          </Link>

          <Link to='/matches' style={styles.card}>
            <h3>🏆 Matches</h3>
            <p>View all matches</p>
          </Link>

          <Link to='/analytics' style={styles.card}>
            <h3>📊 Analytics</h3>
            <p>Rankings, comparisons and leaderboards</p>
          </Link>

          <Link to='/trials' style={styles.card}>
            <h3>🎯 Trials</h3>
            <p>View all trials and camps</p>
          </Link>

        </div>

        {/* ---- PLAYER ONLY ---- */}
        {user?.role === 'Player' && (
          <>
            <h3 style={styles.sectionTitle}>👤 My Stuff</h3>
            <div style={styles.cards}>

              <Link to='/my-profile' style={{...styles.card, ...styles.cardBlue}}>
                <h3>👤 My Profile</h3>
                <p>View and edit your profile</p>
              </Link>

              <Link to='/add-player' style={{...styles.card, ...styles.cardBlue}}>
                <h3>➕ Create Profile</h3>
                <p>Create your player profile</p>
              </Link>

              <Link to='/scout-requests' style={{...styles.card, ...styles.cardBlue}}>
                <h3>🔭 Scout Requests</h3>
                <p>View requests from coaches</p>
              </Link>

              <Link to='/change-password' style={{...styles.card, ...styles.cardBlue}}>
                <h3>🔐 Change Password</h3>
                <p>Update your password</p>
              </Link>

            </div>
          </>
        )}

        {/* ---- COACH ONLY ---- */}
        {user?.role === 'Coach' && (
          <>
            <h3 style={styles.sectionTitle}>🏋️ Coach Tools</h3>
            <div style={styles.cards}>

              <Link to='/matches/create' style={{...styles.card, ...styles.cardGreen}}>
                <h3>➕ Create Match</h3>
                <p>Create a new match</p>
              </Link>

              <Link to='/trials/create' style={{...styles.card, ...styles.cardGreen}}>
                <h3>🎯 Create Trial</h3>
                <p>Create a trial or camp</p>
              </Link>

              <Link to='/scout-requests' style={{...styles.card, ...styles.cardGreen}}>
                <h3>🔭 Scout Players</h3>
                <p>Send scout requests to players</p>
              </Link>

              <Link to='/change-password' style={{...styles.card, ...styles.cardGreen}}>
                <h3>🔐 Change Password</h3>
                <p>Update your password</p>
              </Link>

            </div>
          </>
        )}

        {/* ---- ADMIN ONLY ---- */}
        {user?.role === 'Admin' && (
          <>
            <h3 style={styles.sectionTitle}>⚙️ Admin Tools</h3>
            <div style={styles.cards}>

              <Link to='/add-player' style={{...styles.card, ...styles.cardGreen}}>
                <h3>➕ Add Player</h3>
                <p>Register a new player</p>
              </Link>

              <Link to='/matches/create' style={{...styles.card, ...styles.cardGreen}}>
                <h3>➕ Create Match</h3>
                <p>Create a new match</p>
              </Link>

              <Link to='/trials/create' style={{...styles.card, ...styles.cardGreen}}>
                <h3>🎯 Create Trial</h3>
                <p>Create a trial or camp</p>
              </Link>

              <Link to='/change-password' style={{...styles.card, ...styles.cardGreen}}>
                <h3>🔐 Change Password</h3>
                <p>Update your password</p>
              </Link>

            </div>
          </>
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
  navTitle:     { color: '#fff', fontSize: '20px' },
  navRight:     { display: 'flex', alignItems: 'center', gap: '15px' },
  userInfo:     { color: '#fff', fontSize: '14px' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#fff',
    color: '#006400', border: 'none', borderRadius: '5px',
    cursor: 'pointer', fontWeight: 'bold',
  },
  content:      { padding: '40px' },
  welcome:      { fontSize: '24px', marginBottom: '10px' },
  roleText:     { fontSize: '16px', marginBottom: '20px', color: '#666' },
  sectionTitle: { fontSize: '16px', color: '#555', margin: '20px 0 10px' },
  cards:        { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '10px' },
  card: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '170px',
    textDecoration: 'none', color: '#333', textAlign: 'center',
  },
  cardGreen:    { borderTop: '4px solid #006400' },
  cardBlue:     { borderTop: '4px solid #0047AB' },
};

export default Dashboard;