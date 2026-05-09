import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login              from './pages/Login';
import Register           from './pages/Register';
import Dashboard          from './pages/Dashboard';
import AddPlayer          from './pages/AddPlayer';
import Players            from './pages/Players';
import Matches            from './pages/Matches';
import CreateMatch        from './pages/CreateMatch';
import MatchDetail        from './pages/MatchDetail';
import MyProfile          from './pages/MyProfile';
import EditPlayerSkills   from './pages/EditPlayerSkills';
import AddPerformance     from './pages/AddPerformance';
import Analytics          from './pages/Analytics';
import Rankings           from './pages/Rankings';
import Compare            from './pages/Compare';
import TalentSearch       from './pages/TalentSearch';
import Leaderboards       from './pages/Leaderboards';
import Trials             from './pages/Trials';
import CreateTrial        from './pages/CreateTrial';
import ScoutRequests      from './pages/ScoutRequests';
import ChangePassword     from './pages/ChangePassword';
import Trends             from './pages/Trends';
import EnterMatchStats    from './pages/EnterMatchStats';
import PlayerAchievements from './pages/PlayerAchievements';

// -----------------------------------------------
// PROTECTED ROUTE
// Checks if user is logged in
// -----------------------------------------------
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path='/login'    element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Protected routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path='/players' element={
            <ProtectedRoute><Players /></ProtectedRoute>
          } />
          <Route path='/add-player' element={
            <ProtectedRoute><AddPlayer /></ProtectedRoute>
          } />
          <Route path='/matches' element={
            <ProtectedRoute><Matches /></ProtectedRoute>
          } />
          <Route path='/matches/create' element={
            <ProtectedRoute><CreateMatch /></ProtectedRoute>
          } />
          <Route path='/matches/:id' element={
            <ProtectedRoute><MatchDetail /></ProtectedRoute>
          } />
          <Route path='/matches/:matchId/stats' element={
            <ProtectedRoute><EnterMatchStats /></ProtectedRoute>
          } />
          <Route path='/my-profile' element={
            <ProtectedRoute><MyProfile /></ProtectedRoute>
          } />
          <Route path='/edit-skills/:id' element={
            <ProtectedRoute><EditPlayerSkills /></ProtectedRoute>
          } />
          <Route path='/add-performance/:id' element={
            <ProtectedRoute><AddPerformance /></ProtectedRoute>
          } />
          <Route path='/analytics' element={
            <ProtectedRoute><Analytics /></ProtectedRoute>
          } />
          <Route path='/rankings' element={
            <ProtectedRoute><Rankings /></ProtectedRoute>
          } />
          <Route path='/compare' element={
            <ProtectedRoute><Compare /></ProtectedRoute>
          } />
          <Route path='/talent-search' element={
            <ProtectedRoute><TalentSearch /></ProtectedRoute>
          } />
          <Route path='/leaderboards' element={
            <ProtectedRoute><Leaderboards /></ProtectedRoute>
          } />
          <Route path='/trials' element={
            <ProtectedRoute><Trials /></ProtectedRoute>
          } />
          <Route path='/trials/create' element={
            <ProtectedRoute><CreateTrial /></ProtectedRoute>
          } />
          <Route path='/scout-requests' element={
            <ProtectedRoute><ScoutRequests /></ProtectedRoute>
          } />
          <Route path='/change-password' element={
            <ProtectedRoute><ChangePassword /></ProtectedRoute>
          } />
          <Route path='/trends/:playerId' element={
            <ProtectedRoute><Trends /></ProtectedRoute>
          } />
          <Route path='/achievements/:playerId' element={
            <ProtectedRoute><PlayerAchievements /></ProtectedRoute>
          } />

          {/* Default route */}
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;